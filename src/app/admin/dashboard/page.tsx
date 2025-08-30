import LogOutButton from "@/components/commons/LogOutButton";
import { prisma } from "@/lib/prismaClient";
import { getSession } from "@/lib/session";
import React from "react";

export default async function page() {
  const session = await getSession();
  const dataAdmin = await prisma.admin.findUnique({
    where: {
      id: Number(session?.id),
    },
  });

  return (
    <section className="flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl">Dashboard</h1>
          <span className="text-2xl pl-2">
            Selamat datang {""}
            <span className="font-semibold capitalize">
              {dataAdmin?.fullname}
            </span>{" "}
            👋
          </span>
        </div>
        <LogOutButton role={session?.role} />
      </div>
    </section>
  );
}
