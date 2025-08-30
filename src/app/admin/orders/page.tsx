import PaginationControl from "@/components/commons/PaginationControl";
import TableDataOrders from "@/components/commons/TableDataOrders";
import { getAllOrdersDetail } from "@/lib/orders/queries";
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

  const dataOrders = await getAllOrdersDetail({ skip, take: limit });
  const totalOrders = await prisma.order.count();
  const totalPages = Math.ceil(totalOrders / limit);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="text-2xl">Data All Orders 👋</h1>
      </div>
      <TableDataOrders page={page} dataOrders={dataOrders}></TableDataOrders>
      <PaginationControl
        basePath={"/admin/orders"}
        totalPage={totalPages}
        currentPage={page}
      ></PaginationControl>
    </section>
  );
}
