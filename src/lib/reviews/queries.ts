import { prisma } from "../prismaClient";

export async function getReviewProductByProductId({
  productId,
  skip,
  take,
}: {
  productId: string;
  skip: number;
  take: number;
}) {
  const review = await prisma.review.findMany({
    where: {
      productId,
    },
    skip,
    take,
    include: {
      user: {
        select: {
          username: true,
        },
      },
      ImageReview: {
        select: {
          id: true,
          // publicId: true,
          url: true,
        },
      },
    },
  });

  if (!review) return { status: 404, errors: "Product Not Found" };
  return { status: 200, data: review };
}
