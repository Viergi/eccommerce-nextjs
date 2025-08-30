import CardList from "@/components/commons/CardList";
import PaginationControl from "@/components/commons/PaginationControl";
import { prisma } from "@/lib/prismaClient";
import { getProductByPage } from "@/lib/product/queries";
import { notFound } from "next/navigation";
import React from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page as string) : 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  const dataProducts = await getProductByPage({ skip, take: limit });

  const totalProducts = await prisma.product.count();
  const totalPages = Math.ceil(totalProducts / limit);

  if (!dataProducts.data) return notFound();

  return (
    <section className="p-12 flex flex-col gap-10">
      <h1 className="text-2xl font-bold">Jelajahi Produk Kami</h1>
      <CardList dataProducts={dataProducts.data}></CardList>
      <PaginationControl
        basePath="/product"
        currentPage={page}
        totalPage={totalPages}
      ></PaginationControl>
    </section>
  );
}
