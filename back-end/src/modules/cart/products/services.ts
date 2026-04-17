import { pool } from '../../../config/db';
import { prisma } from '../../../libs/prisma';

type SortOption = 'relevance' | 'price_asc' | 'price_desc';

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

export async function productsSearchService(
  query: string,
  sort: SortOption = 'relevance',
  limit = 20,
  offset = 0,
) {
  let orderBy = '';
  if (sort === 'price_asc') {
    orderBy = ', base_price ASC';
  } else if (sort === 'price_desc') {
    orderBy = ', base_price DESC';
  } else {
    orderBy = '';
  }

  const sql = `
    SELECT 
      title,
      description,
      base_price,
      main_image,
      COALESCE(
        ts_rank(search_vector, websearch_to_tsquery('english', $1)), 
        0
      ) AS rank,
      GREATEST(
        similarity(title, $1),
        word_similarity(title, $1),
        similarity(description, $1),
        word_similarity(description, $1)
      ) AS sim
    FROM product
    WHERE 
      search_vector @@ websearch_to_tsquery('english', $1)
      OR word_similarity(title, $1) > 0.3
      OR word_similarity(description, $1) > 0.3
      OR similarity(description, $1) > 0.3
    ORDER BY 
      (search_vector @@ websearch_to_tsquery('english', $1))::int DESC,
      GREATEST(
        similarity(title, $1),
        word_similarity(title, $1),
        similarity(description, $1),
        word_similarity(description, $1)
      ) DESC${orderBy}
    LIMIT $2 OFFSET $3;
  `;

  const { rows } = await pool.query(sql, [query, limit, offset]);

  return rows;
}

export async function productsAddService(
  title: string,
  description: string,
  basePrice: string,
  category: string,
  attributes: Record<string, string>,
  stock: string,
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
        product_variant: {
          create: {
            attributes: attributes,
            stock: Number(stock),
            price_override: Number(basePrice),
          },
        },
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
      if (images.count === 0) {
        throw new Error('It was not possible to sync extra images to the product');
      }
    }
  });
}

export async function productsAttService(
  id: string,
  title: string | undefined,
  description: string | undefined,
  basePrice: string | undefined,
  category: string | undefined,
  mainImagePath: string | undefined,
  extraImagesPaths: string[] | undefined,
) {
  return prisma.$transaction(async tx => {
    const currentProduct = await tx.product.findUnique({ where: { id } });
    if (!currentProduct) throw new Error('Product not found');

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
  });
}

export async function productsDeleteService(id: string) {
  return prisma.$transaction(async tx => {
    // const variants = await tx.productVariant.findMany({ where: { product_id: id } });
    // const variantIds = variants.map(v => v.id);

    // if (variantIds.length > 0) {
    //   await tx.cartItem.deleteMany({ where: { variant_id: { in: variantIds } } });
    //   await tx.inventoryReservation.deleteMany({ where: { variant_id: { in: variantIds } } });
    // }

    await tx.productVariant.deleteMany({ where: { product_id: id } });
    await tx.productCategory.deleteMany({ where: { product_id: id } });
    await tx.extraImagens.deleteMany({ where: { product_id: id } });
    // await tx.review.deleteMany({ where: { product_id: id } });
    await tx.product.deleteMany({ where: { id } });
  });
}
