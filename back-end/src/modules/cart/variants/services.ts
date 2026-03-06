// import { prisma } from '../../../libs/prisma';

// export async function productsByGroupService(groupName: string) {
//   const products = await prisma.product.findMany({
//     where: { group_name: groupName },
//     include: {
//       product_variant: true,
//       product_caregory: { include: { category_sync: true } },
//     },
//   });
//   return products;
// }