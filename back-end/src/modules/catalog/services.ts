import { prisma } from "../../libs/prisma";

export async function categoryService () {
  const results = await prisma.category.findMany();
  if (!results) throw new Error("Cant finded categorys");

  return { results }
} 