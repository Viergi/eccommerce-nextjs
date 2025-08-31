import AddBannerButton from "@/components/commons/AddBannerButton";
import BannerPreview from "@/components/commons/BannerPreview";
import BannerSetting from "@/components/commons/BannerSetting";
import PaginationControl from "@/components/commons/PaginationControl";
import { prisma } from "@/lib/prismaClient";
import React from "react";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page as string) : 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  const dataBanners = await prisma.banner.findMany({
    skip: skip,
    take: limit,
  });
  const totalProducts = await prisma.banner.count();
  const totalPages = Math.ceil(totalProducts / limit);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex justify-between">
        <div>
          <h1 className="text-4xl">Banner</h1>
          <p className="text-lg pl-2">Change Banner</p>
        </div>
        <AddBannerButton></AddBannerButton>
      </div>
      <div className="flex flex-col md:flex-row justify-between gap-2">
        <BannerPreview
          dataBanners={dataBanners.filter((item) => item.status == true)}
        ></BannerPreview>
        <div className="w-full flex flex-col justify-between">
          <BannerSetting dataBanners={dataBanners}></BannerSetting>
          <PaginationControl
            basePath="/admin/banner-settings"
            totalPage={totalPages}
            currentPage={page}
          ></PaginationControl>
        </div>
      </div>
    </section>
  );
}
