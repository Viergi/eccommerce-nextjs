import AddCategoryButton from "@/components/commons/AddCategoryButton";
import PaginationControl from "@/components/commons/PaginationControl";
import TableDataCategory from "@/components/commons/TableDataCategory";
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

  // Mengambil hanya 20 produk yang dibutuhkan dari database
  const dataCategories = await prisma.category.findMany({
    skip: skip,
    take: limit,
    where: {
      deletedAt: null,
    },
    orderBy: [
      { name: "asc" },
      {
        updatedAt: "asc",
      },
    ],
  });

  const totalProducts = await prisma.product.count();
  const totalPages = Math.ceil(totalProducts / limit);

  // const dataCategories = await prisma.category.findMany({
  //   where: {
  //     deletedAt: null,
  //   },
  //   orderBy: {
  //     updatedAt: "asc",
  //   },
  // });
  return (
    <section className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="text-2xl">Data Categories 👋</h1>
        <AddCategoryButton />
      </div>
      <TableDataCategory dataCategories={dataCategories}></TableDataCategory>
      <PaginationControl
        totalPage={totalPages}
        currentPage={page}
        basePath="/admin/categories"
      ></PaginationControl>
    </section>
  );
}
