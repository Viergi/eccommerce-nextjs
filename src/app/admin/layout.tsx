import { AppSidebar } from "@/components/commons/AppSideBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { prisma } from "@/lib/prismaClient";
import { getSession } from "@/lib/session";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Eco Shop Admin",
  description:
    "Eco Shop adalah sebuah platform e-commerce full-stack yang dibangun untuk mendemonstrasikan kapabilitas pengembangan web modern. Proyek ini berfokus pada pengalaman pengguna yang intuitif dan sistem manajemen admin yang efisien, dengan tema produk yang ramah lingkungan dan berkelanjutan.",
  keywords: [
    "e-commerce",
    "full-stack",
    "nextjs",
    "react",
    "typescript",
    "prisma",
    "postgresql",
    "shadcn-ui",
    "tailwind-css",
    "web-development",
    "online-shop",
    "portfolio-project",
    "sustainable-products",
    "admin-dashboard",
    "apiroutes",
    "many-to-many-relationship",
  ],
};

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const admin = await prisma.admin.findUnique({
    where: {
      id: Number(session?.id),
    },
  });
  return (
    <SidebarProvider>
      <AppSidebar admin={admin} />
      <main className="w-full">
        <SidebarTrigger />
        <div className="p-5 pt-10">{children}</div>
      </main>
    </SidebarProvider>
  );
}
