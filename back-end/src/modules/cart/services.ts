import { prisma } from "../../libs/prisma.js";

export async function cartAddService(userId: string, variantId: string, quantity: number = 1) {
  return prisma.$transaction(async (tx) => {
    const cart = await tx.cart.upsert({
      where: { user_id: userId },
      update: {},
      create: { user_id: userId },
    });

    const variant = await tx.productVariant.findUniqueOrThrow({
      where: { id: variantId },
      include: { product_sync: { select: { base_price: true } } },
    });

    if (variant.stock < quantity) throw new Error("Insufficient stock");

    const unitPrice = variant.price_override
      ? Number(variant.price_override)
      : Number(variant.product_sync.base_price);

    const existing = await tx.cartItem.findFirst({
      where: { cart_id: cart.id, variant_id: variantId },
    });

    if (existing) {
      return tx.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    }

    return tx.cartItem.create({
      data: {
        cart_id: cart.id,
        variant_id: variantId,
        quantity,
        unit_price_snapshot: unitPrice,
      },
    });
  });
}

export async function cartGetService(userId: string) {
  return prisma.cart.findFirst({
    where: { user_id: userId },
    include: { cart_item: { include: { variant_sync: true } } },
  });
}

export async function cartPutService(userId: string, itemId: string, quantity: number) {
  return prisma.cartItem.updateMany({
    where: { id: itemId, cart_sync: { user_id: userId } },
    data: { quantity },
  });
}

export async function cartDeleteService(userId: string, itemId: string) {
  await prisma.cartItem.deleteMany({
    where: { id: itemId, cart_sync: { user_id: userId } },
  });
}