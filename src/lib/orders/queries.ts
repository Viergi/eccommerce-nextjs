/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "../prismaClient";
import { FullOrderDetails } from "../type";

export async function getAllOrdersByUserId(userId: string) {
  try {
    //pake select
    const result = await prisma.order.findMany({
      where: {
        userId,
      },
    });
    return { status: 200, data: result };
  } catch (error) {
    return { status: 500, errors: "Fetching Error" };
  }
}

export async function getOrderById({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  const result = await getOrderDetails(id, userId);

  if (!result) return { status: 404, errors: "Order Not Found" };

  return { status: 200, data: result };
}

export async function getOrderDetails(
  orderId: string,
  userId: string
): Promise<FullOrderDetails | null> {
  // Simulasikan pengambilan data dari database
  // Di aplikasi nyata, Anda akan memanggil Prisma di sini
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
      userId,
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
      orderItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              imageUrl: true,
            },
          },
        },
      },
    },
  });

  if (!order) return null;

  return order;
}

export async function getAllOrdersDetail({
  skip,
  take,
}: {
  skip: number;
  take: number;
}) {
  const allOrderDetail = await prisma.order.findMany({
    skip: skip,
    take: take,
    orderBy: {
      updatedAt: "asc",
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
      orderItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              imageUrl: true,
            },
          },
        },
      },
    },
  });
  return allOrderDetail;
}
