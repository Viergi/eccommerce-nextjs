import PaginationControl from "@/components/commons/PaginationControl";
import TableDataUser from "@/components/commons/TableDataUser";
import { prisma } from "@/lib/prismaClient";
import { getUsersWithOrderCount } from "@/lib/user/queries";
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
  const dataUsers = await getUsersWithOrderCount({ skip, take: limit });

  const totalOrders = await prisma.order.count();
  const totalPages = Math.ceil(totalOrders / limit);
  return (
    <section className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="text-2xl">Data User 👋</h1>
      </div>
      <TableDataUser page={page} dataUsers={dataUsers}></TableDataUser>
      {dataUsers.length > 20 && (
        <PaginationControl
          basePath={"/admin/manage-user"}
          totalPage={totalPages}
          currentPage={page}
        ></PaginationControl>
      )}
    </section>
  );
}
