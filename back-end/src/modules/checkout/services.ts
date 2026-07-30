import { prisma } from '../../libs/prisma.js';
import { stripe } from '../../libs/stripe.js';
import { HttpError } from '../../common/utils/errors.js';
import type Stripe from 'stripe';

export async function createCheckoutSessionService(
  userId: string,
  shippingAddress?: Record<string, unknown>,
  currency: string = 'brl',
  cartItemIds?: string[],
) {
  if (!stripe) throw new HttpError(500, 'Stripe not configured', 'STRIPE_NOT_CONFIGURED');

  const cart = await prisma.cart.findFirst({
    where: { user_id: userId },
    include: {
      cart_item: {
        include: {
          variant_sync: { include: { product_sync: { select: { title: true } } } },
          inventory_reservation: true,
        },
      },
    },
  });

  if (!cart || cart.cart_item.length === 0) {
    throw new HttpError(400, 'Cart is empty', 'EMPTY_CART');
  }

  const selectedItems = cartItemIds
    ? cart.cart_item.filter((item) => cartItemIds.includes(item.id))
    : cart.cart_item;

  if (selectedItems.length === 0) {
    throw new HttpError(400, 'No cart items selected', 'NO_SELECTED_ITEMS');
  }

  const now = new Date();
  for (const item of selectedItems) {
    if (!item.inventory_reservation || item.inventory_reservation.expires_at <= now) {
      throw new HttpError(
        409,
        'One or more cart items have an expired stock reservation. Please refresh your cart and try again.',
        'STALE_RESERVATION',
      );
    }
  }

  const total = selectedItems.reduce(
    (sum, item) => sum + Number(item.unit_price_snapshot) * item.quantity,
    0,
  );

  if (total <= 0) {
    throw new HttpError(400, 'Order total must be greater than 0', 'INVALID_TOTAL');
  }

  const selectedCartItemIds = selectedItems.map((item) => item.id);

  if (selectedCartItemIds.length > 0) {
    await prisma.orderItem.updateMany({
      where: { cart_item_id: { in: selectedCartItemIds } },
      data: { cart_item_id: null },
    });
  }

  const order = await prisma.order.create({
    data: {
      user_id: userId,
      status: 'PENDING',
      total,
      currency,
      ...(shippingAddress ? { shipping_address: shippingAddress as object } : {}),
      order_item: {
        create: selectedItems.map((item) => ({
          variant_id: item.variant_id,
          cart_item_id: item.id,
          quantity: item.quantity,
          unit_price_snapshot: item.unit_price_snapshot,
          product_title_snapshot: item.variant_sync.product_sync.title,
          variant_attributes_snapshot: item.variant_sync.attributes as object,
        })),
      },
    },
  });

  let paymentIntent: Stripe.PaymentIntent;
  try {
    paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(total.toFixed(2)) * 100),
      currency,
      automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
      metadata: { order_id: order.id, user_id: userId },
    });
  } catch (err) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'FAILED' },
    });
    throw new HttpError(502, `Stripe error: ${(err as Error).message}`, 'STRIPE_ERROR');
  }

  await prisma.order.update({
    where: { id: order.id },
    data: {
      stripe_payment_intent_id: paymentIntent.id,
      stripe_client_secret: paymentIntent.client_secret ?? null,
    },
  });

  return {
    order_id: order.id,
    client_secret: paymentIntent.client_secret,
    order_status: order.status,
    total,
    currency,
  };
}

export async function getCheckoutStatusService(userId: string, orderId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, user_id: userId },
    select: {
      id: true,
      status: true,
      total: true,
      currency: true,
      stripe_client_secret: true,
    },
  });

  if (!order) throw new HttpError(404, 'Order not found', 'ORDER_NOT_FOUND');

  return order;
}