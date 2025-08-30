import AddProductButton from "@/components/commons/AddProductButton";
import PaginationControl from "@/components/commons/PaginationControl";
import TableDataProducts from "@/components/commons/TableDataProducts";
import { prisma } from "@/lib/prismaClient";
import React from "react";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page as string) : 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  const dataProducts = await prisma.product.findMany({
    skip: skip,
    take: limit,
    orderBy: [
      { name: "asc" },
      {
        updatedAt: "asc",
      },
    ],
  });

  const totalProducts = await prisma.product.count();
  const totalPages = Math.ceil(totalProducts / limit);
  const dataCategories = await prisma.category.findMany({
    where: {
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      description: true,
    },
    orderBy: {
      name: "asc",
    },
  });
  return (
    <section className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="text-2xl">Data Product 👋</h1>
        <AddProductButton categories={dataCategories} />
      </div>
      <TableDataProducts
        page={page}
        dataProducts={dataProducts}
        categories={dataCategories}
      ></TableDataProducts>
      <PaginationControl
        basePath={"/admin/products"}
        totalPage={totalPages}
        currentPage={page}
      ></PaginationControl>
    </section>
  );
}
