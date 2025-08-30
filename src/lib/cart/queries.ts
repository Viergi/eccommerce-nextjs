// /* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "../prismaClient";

// export async function getAllCarts() {
//   try {
//     //pake select
//     const result = await prisma.product.findMany();
//     return { status: 200, data: result };
//   } catch (error) {
//     return { status: 500, errors: "Fetching Error" };
//   }
// }

export async function getCartByUserId(userId: string) {
  const result = await prisma.cartItem.findMany({
    where: {
      userId,
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          imageUrl: true,
        },
      },
    },
  });
  if (result.length == 0) return { status: 404, errors: "Cart Not Found" };
  return { status: 200, data: result };
}

export async function getProductByCategory() {}
