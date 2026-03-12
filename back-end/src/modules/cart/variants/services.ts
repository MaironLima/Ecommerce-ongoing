import { prisma } from '../../../libs/prisma';

export async function variantGetService(productId: string) {
  const variants = await prisma.productVariant.findMany({ where: { product_id: productId } });

  const map = variants.map(v => ({
    attributes: v.attributes,
    stock: v.stock,
    priceOverride: v.price_override,
  }));

  return map;
}

export async function variantAddService(
  id: string,
  attributes: Record<string, string>,
  stock: string | number,
  priceOverride: string | number,
) {
  await prisma.productVariant.create({
    data: {
      product_id: id,
      attributes: attributes,
      stock: Number(stock),
      price_override: priceOverride,
    },
  });
}

export async function variantAttService(
  variantId: string,
  attributes: Record<string, string> | undefined,
  stock: string | undefined,
  priceOverride: string | undefined,
) {
  const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
  if (!variant) throw new Error('Cannot find exactly product variant');

  const dataUpdater: any = {};
  if (attributes) dataUpdater.attributes = attributes;
  if (stock) dataUpdater.stock = Number(stock);
  if (priceOverride) dataUpdater.price_override = Number(priceOverride);

  await prisma.productVariant.update({
    where: { id: variantId },
    data: dataUpdater,
  });
}
