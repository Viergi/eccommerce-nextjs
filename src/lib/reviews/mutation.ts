import { prisma } from "../prismaClient";
import { backendReviewSchema, backendUpdateReviewSchema } from "../zodSchema";
import z from "zod";

import { v2 as cloudinary } from "cloudinary";

// Konfigurasi Cloudinary dari environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type backendReviewValues = z.infer<typeof backendReviewSchema>;

export async function createReviews({
  data,
  userId,
  productId,
}: {
  productId: string;
  userId: string;
  data: backendReviewValues;
}) {
  const { comment, rating, image } = data;

  const validationResult = backendReviewSchema.safeParse(data);

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

  let newReview = null;
  const listImages = image?.map((item) => {
    const publicId = item.split("/").pop()?.split(".")[0];
    return {
      url: item,
      publicId: publicId,
    };
  });

  if (listImages) {
    // 3. Jika semua validasi lolos, buat ulasan baru
    newReview = await prisma.review.create({
      data: {
        userId: userId,
        productId: productId,
        rating: rating,
        comment: comment,
        ImageReview: {
          createMany: {
            data: listImages,
          },
        },
      },
    });
  } else {
    newReview = await prisma.review.create({
      data: {
        userId: userId,
        productId: productId,
        rating: rating,
        comment: comment,
      },
    });
  }

  if (!newReview) return { errors: "Failed create reviews", status: 500 };
  return { data: newReview, status: 200 };
}

export type backendUpdateReviewFormValues = z.infer<
  typeof backendUpdateReviewSchema
>;
export async function updateReview({
  data,
  id,
  userId,
}: {
  data: backendUpdateReviewFormValues;
  id: string;
  userId: string;
}) {
  const { comment, rating, newImages, deletedImages } = data;
  const validationResult = backendUpdateReviewSchema.safeParse(data);

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
  try {
    const transactionResult = await prisma.$transaction(async (prisma) => {
      const review = await prisma.review.update({
        where: { id, userId },
        data: { comment, rating },
      });

      if (deletedImages != undefined && deletedImages.length > 0) {
        const cloudinaryPublicIds = deletedImages.map((imageUrl) => {
          const lastSegment = imageUrl.split("/").pop();
          return lastSegment ? lastSegment.split(".")[0] : "";
        });

        await Promise.all(
          cloudinaryPublicIds.map((publicId) =>
            cloudinary.uploader.destroy(`eco_shop/${publicId}`)
          )
        );

        // Hapus dari database (gunakan publicId)
        await prisma.imageReview.deleteMany({
          where: {
            publicId: {
              in: cloudinaryPublicIds,
            },
          },
        });
      }

      if (newImages != undefined && newImages.length > 0) {
        const newImageRecords = newImages.map((imageUrl) => {
          const lastSegment = imageUrl.split("/").pop();
          const publicId = lastSegment ? lastSegment.split(".")[0] : "";

          return {
            url: imageUrl,
            reviewId: review.id,
            publicId: publicId,
          };
        });

        await prisma.imageReview.createMany({
          data: newImageRecords,
        });
      }

      return review;
    });

    return { data: transactionResult, status: 200 };
  } catch (error) {
    return { errors: error, status: 500 };
  }
}

export async function updateImage(idDeleteImage: string[]) {
  // TODO: Image edit
  idDeleteImage.forEach(async (imageUrl) => {
    // Extract public ID from the image URL
    const lastSegment = imageUrl.split("/").pop();
    const publicId = lastSegment ? lastSegment.split(".")[0] : "";

    console.log(publicId);

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(`eco_shop/${publicId}`);
    await prisma.imageReview.delete({
      where: {
        publicId,
      },
    });
  });
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
