import { prisma } from '../../../libs/prisma';

export async function categoriesService() {
  const results = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });
  return { results };
}

