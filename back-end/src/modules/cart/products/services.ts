import { prisma } from '../../../libs/prisma';

export async function productsService() {
  const results = await prisma.product.findMany();
  if (!results) throw new Error("Can't find the products");

  return { results };
}

export async function productsGetService(id: string) {
  const result = await prisma.product.findUnique({ where: { id } });
  if (!result) throw new Error('Item not found');

  return { result };
}

export async function productsAddService(
  title: string,
  description: string,
  basePrice: number,
  category: string,
  mainImage: Express.Multer.File,
  extraImages: Express.Multer.File[],
) {
  return prisma.$transaction(async tx => {
    const mainImagePath = mainImage.path;
    const product = await tx.product.create({
      data: {
        title: title,
        description: description,
        base_price: Number(basePrice),
        main_image: mainImagePath,
      },
    });
    if (!product) throw new Error('It was not possible to create the product');

    let categoryRecord = await tx.category.findFirst({ where: { name: category } });
    if (!categoryRecord) {
      categoryRecord = await tx.category.create({
        data: {
          name: category,
        },
      });
    }
    const categoryRelation = await tx.productCategory.create({
      data: {
        product_id: product.id,
        category_id: categoryRecord.id,
      },
    });
    if (!categoryRelation) throw new Error('It was not possible relation the product with the category');

    if (extraImages && extraImages.length > 0) {
      const images = await tx.extraImagens.createMany({
        data: extraImages.map(img => ({
          product_id: product.id,
          path: [img.path],
          width: 0,
          height: 0,
          optimized: false,
        })),
      });
      if (images.count === 0)
        throw new Error('It was not possible to sync extra images to the product');
    }
  });
}
