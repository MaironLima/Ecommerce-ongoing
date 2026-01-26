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


// mudar imagens para adicionar a imagem e não o url
export async function productsAddService(
  title: string,
  description: string,
  basePrice: number,
  categoryId: string,
  mainImage: string,
  extraImages: string[],
) {

 return prisma.$transaction(async (tx) =>{
    const product = await tx.product.create({
    data: {
      title: title,
      description: description,
      base_price: basePrice,
      main_image: mainImage,
    },
  });
  if (!product) throw new Error('It was not possible to create the product');

    const category = await tx.productCategory.create({
    data: {
      product_id: product.id,
      category_id: categoryId,
    },
  });
  if (!category) throw new Error('It was not possible sync the product with the category');

  if (extraImages && extraImages.length > 0) {
    const images = await tx.extraImagens.create({
      data: {
        product_id: product.id,
        path: extraImages,
        width: 0,
        height: 0,
        optimized: false,
      },
    });
    if (!images) throw new Error('It was not possible sync extra images to the product');
  }
 })
}
