import PaginationControl from "@/components/commons/PaginationControl";
import TableDataAdmin from "@/components/commons/TableDataAdmin";
import { prisma } from "@/lib/prismaClient";
import { getSession } from "@/lib/session";
import React from "react";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getSession();
  const params = await searchParams;
  const page = params.page ? parseInt(params.page as string) : 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  const totalOrders = await prisma.order.count();
  const totalPages = Math.ceil(totalOrders / limit);

  const dataAllAdmin = await prisma.admin.findMany({
    where: {
      id: {
        not: Number(session?.id),
      },
    },
    skip,
    take: limit,
  });

  return (
    <section className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="text-4xl">Admin Management</h1>
      </div>
      <TableDataAdmin dataAllAdmin={dataAllAdmin} role={session?.role} />
      {dataAllAdmin.length > 20 && (
        <PaginationControl
          basePath={"/admin/manage-admin"}
          totalPage={totalPages}
          currentPage={page}
        ></PaginationControl>
      )}
    </section>
  );
}
