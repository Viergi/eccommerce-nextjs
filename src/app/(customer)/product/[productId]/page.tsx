import CardList from "@/components/commons/CardList";
import PaginationControl from "@/components/commons/PaginationControl";
import ProductImage from "@/components/commons/ProductImage";
import ProductInfo from "@/components/commons/ProductInfo";
import ReviewCard from "@/components/commons/ReviewCard";
import ReviewForm from "@/components/Form/ReviewForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prismaClient";
import { getReviewProductByProductId } from "@/lib/reviews/queries";
import { getSession } from "@/lib/session";
import { ChevronLeft, Star } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

export default async function page({
  params,
  searchParams,
}: {
  params: Promise<{ productId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getSession();
  const productId = (await params).productId;
  const searchparams = await searchParams;
  const page = searchparams.page ? parseInt(searchparams.page as string) : 1;
  const limit = 5;
  const skip = (page - 1) * limit;

  const dataReviews = await getReviewProductByProductId({
    productId,
    skip,
    take: limit,
  });

  const totalReview = await prisma.review.count({
    where: {
      productId,
    },
  });
  const totalPages = Math.ceil(totalReview / limit);

  if (!dataReviews.data) return notFound();

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product?.categoryId,
      id: {
        not: productId,
      },
    },
    take: 6,
  });

  let productIsBought = false;
  // 1. Cek apakah produk sudah dibeli dan pesanan sudah selesai
  if (session?.id) {
    const hasBoughtProduct = await prisma.order.findFirst({
      where: {
        userId: session?.id,
        // note: status ini ganti nanti
        status: {
          notIn: ["CANCELLED", "PENDING"],
        },
        orderItems: {
          some: {
            productId: productId,
          },
        },
      },
    });

    if (hasBoughtProduct) {
      const existingReview = await prisma.review.findFirst({
        where: {
          userId: session?.id,
          productId: productId,
        },
      });
      if (!existingReview) {
        productIsBought = true;
      }
    }
  }

  if (!product) {
    notFound();
  }

  const totalRating = dataReviews.data.reduce((total, reviewItem) => {
    return total + reviewItem.rating;
  }, 0);
  const averageRating = totalRating / dataReviews.data.length;
  return (
    <section className="flex-grow max-w-7xl mx-auto p-6 md:p-8 mb-50">
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-6 flex items-center space-x-2">
          <Link href="/">
            <Button variant="ghost" className="p-2">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Kembali ke Home
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <ProductImage imageUrl={product.imageUrl} />
              <ProductInfo product={product} session={session} />
            </div>
            <div className="gap-2 flex flex-col mt-4">
              <h1 className="text-xl font-bold">Deskripsi Produk:</h1>
              <p>{product.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Garis pemisah */}
        <hr className="my-10" />

        {/* Bagian Rating dan Ulasan */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Rating & Ulasan</h2>

          {/* Rating Rata-Rata */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Rating Rata-Rata</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center space-x-4">
              <div className="text-5xl font-bold text-blue-600">
                {dataReviews.data.length == 0 ? "0" : `${averageRating}`}
                <span className="text-lg">
                  /<span className="text-sm">5.0</span>
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-6 w-6 ${
                        averageRating > i ? "fill-yellow-400" : ""
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-500 text-sm">
                  {dataReviews.data.length} Ulasan
                </p>
              </div>
            </CardContent>
          </Card>

          {/* // ! ulasan pake pagination */}
          {/* Daftar Ulasan */}
          <h3 className="text-xl font-bold mb-4">Ulasan dari Pengguna</h3>

          {dataReviews.data.length > 0 ? (
            <>
              <div className="space-y-4 mt-4">
                {dataReviews.data.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    session={session}
                    productId={product.id}
                  />
                ))}
              </div>
              <PaginationControl
                basePath={`/product/${productId}`}
                currentPage={page}
                totalPage={totalPages}
              ></PaginationControl>
            </>
          ) : (
            <p className="text-gray-500">Belum ada ulasan untuk produk ini.</p>
          )}
          {productIsBought && <ReviewForm productId={product.id} />}
        </div>
      </div>

      {/* // ! buat infinite scroll
       */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-lg font-bold py-4">Related Products</h2>
          <CardList dataProducts={relatedProducts} />
        </div>
      )}
    </section>
  );
}
