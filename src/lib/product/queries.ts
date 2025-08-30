/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "../prismaClient";

export async function getAllProducts() {
  try {
    //pake select
    const result = await prisma.product.findMany();
    return { status: 200, data: result };
  } catch (error) {
    return { status: 500, errors: "Fetching Error" };
  }
}

export async function getProductByName(q: string) {
  try {
    //pake select
    const result = await prisma.product.findMany({
      where: {
        name: {
          contains: q,
          mode: "insensitive",
        },
      },
    });
    return { status: 200, data: result };
  } catch (error) {
    return { status: 500, errors: "Fetching Error" };
  }
}

export async function getProductById(id: string) {
  const result = await prisma.product.findUnique({
    where: {
      id,
    },
  });
  if (!result) return { status: 404, errors: "Product Not Found" };
  return { status: 200, data: result };
}

export async function getProductByPage({
  skip,
  take,
}: {
  skip: number;
  take: number;
}) {
  const result = await prisma.product.findMany({
    skip: skip,
    take: take,
    orderBy: [
      { name: "asc" },
      {
        updatedAt: "asc",
      },
    ],
  });

  if (!result) return { status: 404, errors: "Product Not Found" };
  return { status: 200, data: result };
}

export async function getProductByCategory() {}
