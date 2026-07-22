import { prisma } from "../../libs/prisma.js";

export async function releaseExpiredReservations() {
  const now = new Date();

  const expired = await prisma.inventoryReservation.findMany({
    where: { expires_at: { lt: now } },
    select: { id: true, variant_id: true, quantity: true },
  });

  if (expired.length === 0) return { released: 0 };

  return prisma.$transaction(async (tx) => {
    const variantStockDelta = new Map<string, number>();
    for (const r of expired) {
      variantStockDelta.set(
        r.variant_id,
        (variantStockDelta.get(r.variant_id) ?? 0) + r.quantity,
      );
    }

    for (const [variantId, totalQty] of variantStockDelta) {
      await tx.productVariant.update({
        where: { id: variantId },
        data: { stock: { increment: totalQty } },
      });
    }

    const { count } = await tx.inventoryReservation.deleteMany({
      where: { id: { in: expired.map(r => r.id) } },
    });

    return { released: count };
  });
}