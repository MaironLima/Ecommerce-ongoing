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
  basePrice: string,
  category: string,
  mainImagePath: string,
  extraImagesPaths: string[],
) {
  return prisma.$transaction(async tx => {
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
    if (!categoryRelation)
      throw new Error('It was not possible relation the product with the category');

    if (extraImagesPaths && extraImagesPaths.length > 0) {
      const images = await tx.extraImagens.createMany({
        data: extraImagesPaths.map(imgPath => ({
          product_id: product.id,
          path: [imgPath],
          width: 800,
          height: 800,
          optimized: true,
        })),
      });
      if (images.count === 0)
        throw new Error('It was not possible to sync extra images to the product');
    }
  });
}

export async function productsAttService(
  id: string,
  title: string,
  description: string,
  basePrice: string,
  category: string,
  mainImagePath: string | undefined,
  extraImagesPaths: string[],
) {
  return prisma.$transaction(async tx => {
    const currentProduct = await tx.product.findUnique({ where: { id } });
    if(!currentProduct) throw new Error("Product not found")

    const updateData: any = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (basePrice) updateData.base_price = Number(basePrice);
    if (mainImagePath) updateData.main_image = mainImagePath;


    const updatedProduct = await tx.product.update({
      where: { id },
      data: updateData,
    });
    if (!updatedProduct) throw new Error('Product not found');

    if (category) {
      let categoryRecord = await tx.category.findFirst({ where: { name: category } });
      if (!categoryRecord) {
        categoryRecord = await tx.category.create({ data: { name: category } });
      }

      await tx.productCategory.deleteMany({ where: { product_id: id } });
      await tx.productCategory.create({
        data: {
          product_id: id,
          category_id: categoryRecord.id,
        },
      });
    }

    if (extraImagesPaths && extraImagesPaths.length > 0) {
      await tx.extraImagens.deleteMany({ where: { product_id: id } });
      const images = await tx.extraImagens.createMany({
        data: extraImagesPaths.map(imgPath => ({
          product_id: id,
          path: [imgPath],
          width: 800,
          height: 800,
          optimized: true,
        })),
      });
      if (images.count === 0) throw new Error('Não foi possível atualizar imagens extras');
    }
    return updatedProduct;
  });
}

export async function productsDeleteService(id: string) {
  return prisma.$transaction(async tx => {
    await tx.extraImagens.deleteMany({ where: { product_id: id } });

    await tx.productCategory.deleteMany({ where: { product_id: id } });

    // await tx.productVariant.deleteMany({ where: { product_id: id } });

    await tx.product.deleteMany({ where: { id } });
  });
}
