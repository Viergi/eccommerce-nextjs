import { ReviewFormValues } from "@/components/Form/ReviewForm";
import { prisma } from "../prismaClient";
import { reviewSchema, updateReviewSchema } from "../zodSchema";

export async function createReviews({
  data,
  userId,
  productId,
}: {
  productId: string;
  userId: string;
  data: ReviewFormValues;
}) {
  const { comment, rating } = data;

  const validationResult = reviewSchema.safeParse(data);

  if (!validationResult.success) {
    const messages = validationResult.error.issues.reduce((acc, err) => {
      acc[err.path[0] as string] = err.message;
      return acc;
    }, {} as Record<string, string>);
    return {
      status: 400,
      errors: messages,
    };
  }

  // 1. Cek apakah produk sudah dibeli dan pesanan sudah selesai
  const hasBoughtProduct = await prisma.order.findFirst({
    where: {
      userId: userId,
      // note: status ini ganti nanti
      //   status: "COMPLETED",
      status: "PAID",
      orderItems: {
        some: {
          productId: productId,
        },
      },
    },
  });

  if (!hasBoughtProduct) {
    // Jika produk belum dibeli atau pesanan belum selesai, tolak
    return { errors: "User has not purchase product", status: 400 };
  }

  // 2. Cek apakah pengguna sudah pernah memberi ulasan
  const existingReview = await prisma.review.findFirst({
    where: {
      userId: userId,
      productId: productId,
    },
  });

  if (existingReview) {
    // Jika sudah pernah memberi ulasan, tolak
    return { errors: "User have reviewed this product", status: 400 };
  }

  // 3. Jika semua validasi lolos, buat ulasan baru
  const newReview = await prisma.review.create({
    data: {
      userId: userId,
      productId: productId,
      rating: rating,
      comment: comment,
    },
  });

  if (!newReview) return { errors: "Failed create reviews", status: 500 };
  return { data: newReview, status: 200 };
}

export async function updateReview({
  data,
  id,
  userId,
}: {
  data: ReviewFormValues;
  id: string;
  userId: string;
}) {
  const { comment, rating } = data;
  const validationResult = updateReviewSchema.safeParse(data);

  if (!validationResult.success) {
    const messages = validationResult.error.issues.reduce((acc, err) => {
      acc[err.path[0] as string] = err.message;
      return acc;
    }, {} as Record<string, string>);
    return {
      status: 400,
      errors: messages,
    };
  }

  const isReviewOwner = await prisma.review.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!isReviewOwner)
    return { errors: "User has not purchase product", status: 400 };

  const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;

  // Tambahkan 30 hari ke tanggal awal
  const thirtyDaysLater = new Date(
    isReviewOwner.createdAt.getTime() + thirtyDaysInMs
  );

  const now = new Date(); // Tanggal dan waktu saat ini

  // Periksa apakah tanggal sekarang sudah lebih dari 30 hari sejak tanggal awal
  const isMoreThanThirtyDays = now > thirtyDaysLater;

  if (isMoreThanThirtyDays)
    return { errors: "Comments are 30 days old", status: 400 };

  const review = await prisma.review.update({
    where: {
      id,
      userId,
    },
    data: {
      comment,
      rating,
    },
  });

  if (!review) return { errors: "Change data failed", status: 500 };
  return { data: review, status: 200 };
}

export async function deleteReview({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  const isReviewOwner = await prisma.review.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!isReviewOwner) return { errors: "Review not found", status: 404 };

  const product = await prisma.review.delete({
    where: {
      id,
      userId,
    },
  });

  if (!product) return { errors: "Delete data failed", status: 500 };
  return { data: product, status: 200 };
}

// export async function updateUser({id, data}) {
//   // Previous steps:
//   // 1. Validate form fields

//   const existingCustomer = await prisma.user.findUnique({
//     where: { username },
//   });

//   if (existingCustomer)
//     return { status: 400, errors: "Username sudah dipakai" };

//   const existingEmail = await prisma.user.findUnique({
//     where: { email },
//   });
//   if (existingEmail) return { status: 400, errors: "Email sudah dipakai" };

//   // 2. Prepare data for insertion into database
//   const hashedPassword = await bcrypt.hash(password, 10);

//   // 3. Insert the user into the database or call an Library API
//   const user = await prisma.user.create({
//     data: {
//       username,
//       email,
//       passwordHash: hashedPassword,
//       nomorTelepon: nomorTelepon,
//     },
//   });
//   if (!user) return { status: 500, errors: "Failed create account" };
//   return { status: 201, data };

// }
