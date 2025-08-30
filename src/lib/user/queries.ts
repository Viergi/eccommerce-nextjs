/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "../prismaClient";

export async function getAllUsers() {
  try {
    //pake select
    const result = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
      },
    });
    return { status: 200, data: result };
  } catch (error) {
    return { status: 500, errors: "Fetching Error" };
  }
}

export async function getUserById(id: string) {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      username: true,
      nomorTelepon: true,
    },
  });
  if (!result) return { status: 404, errors: "Not Found" };
  return { status: 200, data: result };
}

export async function getUserByEmail(email: string) {
  const result = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!result) return { status: 404, errors: "Not Found" };
  return { status: 200, data: result };
}

export async function getUsersWithOrderCount({
  skip,
  take,
}: {
  skip: number;
  take: number;
}) {
  const users = await prisma.user.findMany({
    skip: skip,
    take: take,
    orderBy: {
      updatedAt: "asc",
    },
    select: {
      id: true,
      username: true,
      nomorTelepon: true,
      email: true,
      address: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          orders: true,
        },
      },
    },
  });

  return users.map((user) => ({
    id: user.id,
    username: user.username,
    email: user.email,
    nomorTelepon: user.nomorTelepon,
    updatedAt: user.updatedAt,
    createdAt: user.createdAt,
    address: user.address,
    orderCount: user._count.orders, // Mengambil jumlah pesanan
  }));
}

export async function getUserByIdWithOrderCount(id: string) {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      username: true,
      nomorTelepon: true,
      email: true,
      address: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          orders: true,
        },
      },
    },
  });

  if (!user) return { error: "User not found", status: 404 };

  return {
    data: {
      id: user.id,
      username: user.username,
      email: user.email,
      nomorTelepon: user.nomorTelepon,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
      address: user.address,
      orderCount: user._count.orders, // Mengambil jumlah pesanan
    },
    status: 200,
  };
}
