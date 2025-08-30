import { prisma } from "../prismaClient";

export async function getReviewProductByProductId(id: string) {
  const result = await prisma.review.findMany({
    where: {
      productId: id,
    },
  });
  console.log(result);
  if (!result) return { status: 404, errors: "Reviews Not Found" };
  return { status: 200, data: result };
}
