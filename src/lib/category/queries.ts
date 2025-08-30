/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "../prismaClient";

export async function getAllCategories() {
  try {
    const result = await prisma.category.findMany({
      where: {
        deletedAt: null,
      },
    });
    return { status: 200, data: result };
  } catch (error) {
    return { status: 500, errors: "Fetching Error" };
  }
}

export async function getCategoryById(id: number) {
  const result = await prisma.category.findUnique({
    where: {
      id,
    },
  });
  if (!result) return { status: 404, errors: "Category Not Found" };
  return { status: 200, data: result };
}
