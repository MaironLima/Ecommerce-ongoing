import { prisma } from '../../libs/prisma';

export async function reviewGetAllService() {
  const reviews = await prisma.review.findMany({
    where: {
      moderated: false,
    },
    orderBy: {
      created_at: 'desc',
    },
    select: {
      id: true,
      rating: true,
      title: true,
      comment: true,
      moderated: true,
      created_at: true,

      id_sync: {
        select: {
          id: true,
          name: true,
        },
      },

      product_sync: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return reviews;
}

export async function reviewGetService(productId: string) {
  const reviews = await prisma.review.findMany({
    where: {
      product_id: productId,
    },
    orderBy: {
      created_at: 'desc',
    },
    select: {
      id: true,
      rating: true,
      title: true,
      comment: true,
      created_at: true,

      id_sync: {
        select: {
          name: true,
        },
      },
    },
  });

  return reviews;
}

export async function reviewPostService(
  productId: string,
  userId: string,
  rating: number,
  title: string,
  comment?: string,
) {
  const data = {
    product_id: productId,
    user_id: userId,
    rating,
    title,
    ...(comment !== undefined ? { comment } : {}),
  };

  const review = await prisma.review.create({
    data,
    select: {
      id: true,
      product_id: true,
      user_id: true,
      rating: true,
      title: true,
      comment: true,
      moderated: true,
      created_at: true,
    },
  });

  return review;
}

export async function reviewDeleteService(reviewId: string) {
  await prisma.review.delete({ where: { id: reviewId } });

  return;
}
