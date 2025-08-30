import AddBannerButton from "@/components/commons/AddBannerButton";
import BannerPreview from "@/components/commons/BannerPreview";
import BannerSetting from "@/components/commons/BannerSetting";
import { prisma } from "@/lib/prismaClient";
import React from "react";

export default async function page() {
  const dataBanners = await prisma.banner.findMany();

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
        <BannerSetting dataBanners={dataBanners}></BannerSetting>
      </div>
    </section>
  );
}
