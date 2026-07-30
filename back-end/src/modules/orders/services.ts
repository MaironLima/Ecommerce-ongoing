import { prisma } from '../../libs/prisma.js';
import { stripe } from '../../libs/stripe.js';
import { HttpError } from '../../common/utils/errors.js';

export async function listOrdersService(userId: string) {
  const orders = await prisma.order.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' },
    include: {
      order_item: {
        include: {
          variant_sync: { select: { id: true, stock: true, attributes: true, product_id: true, product_sync: { select: { main_image: true } } } },
        },
      },
    },
  });

  return orders.map((order) => ({
    id: order.id,
    status: order.status,
    total: Number(order.total),
    currency: order.currency,
    created_at: order.created_at,
    items: order.order_item.map((item) => ({
      id: item.id,
      variant_id: item.variant_id,
      quantity: item.quantity,
      unit_price_snapshot: item.unit_price_snapshot,
      product_title_snapshot: item.product_title_snapshot,
      variant_attributes_snapshot: item.variant_attributes_snapshot,
      product_id: item.variant_sync.product_id,
      main_image: item.variant_sync.product_sync.main_image,
    })),
  }));
}

export async function getOrderService(userId: string, orderId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, user_id: userId },
    include: {
      order_item: {
        include: {
          variant_sync: { select: { id: true, stock: true, attributes: true } },
        },
      },
    },
  });

  if (!order) throw new HttpError(404, 'Order not found', 'ORDER_NOT_FOUND');

  return {
    id: order.id,
    status: order.status,
    total: Number(order.total),
    currency: order.currency,
    shipping_address: order.shipping_address,
    created_at: order.created_at,
    updated_at: order.updated_at,
    stripe_payment_intent_id: order.stripe_payment_intent_id,
    items: order.order_item.map((item) => ({
      id: item.id,
      variant_id: item.variant_id,
      quantity: item.quantity,
      unit_price_snapshot: item.unit_price_snapshot,
      product_title_snapshot: item.product_title_snapshot,
      variant_attributes_snapshot: item.variant_attributes_snapshot,
    })),
  };
}

export async function cancelOrderService(userId: string, orderId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, user_id: userId },
    include: { order_item: { select: { id: true, cart_item_id: true } } },
  });

  if (!order) throw new HttpError(404, 'Order not found', 'ORDER_NOT_FOUND');
  if (order.status !== 'PENDING') {
    throw new HttpError(409, `Cannot cancel order in status ${order.status}`, 'INVALID_STATUS');
  }

  if (order.stripe_payment_intent_id) {
    try {
      await stripe.paymentIntents.cancel(order.stripe_payment_intent_id);
    } catch (err) {
      throw new HttpError(502, `Stripe error: ${(err as Error).message}`, 'STRIPE_ERROR');
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: order.id },
      data: { status: 'CANCELLED' },
    });

    const cartItemIds = order.order_item
      .map((item) => item.cart_item_id)
      .filter((id): id is string => Boolean(id));

    if (cartItemIds.length > 0) {
      const reservations = await tx.inventoryReservation.findMany({
        where: { cart_item_id: { in: cartItemIds } },
      });

      for (const reservation of reservations) {
        await tx.productVariant.update({
          where: { id: reservation.variant_id },
          data: { stock: { increment: reservation.quantity } },
        });
        await tx.inventoryReservation.delete({ where: { id: reservation.id } });
      }
    }
  });

  return { id: order.id, status: 'CANCELLED' as const };
}