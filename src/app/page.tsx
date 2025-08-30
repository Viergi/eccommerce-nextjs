import { BannerImage } from "@/components/commons/BannerImage";
import CardList from "@/components/commons/CardList";
import Footer from "@/components/commons/Footer";
import { Navbar } from "@/components/commons/Navbar";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prismaClient";
import Link from "next/link";

export default async function Home() {
  // const dataCategory = await prisma.category.findMany();
  const dataProducts = await prisma.product.findMany({
    where: {
      status: "publish",
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  const dataBanners = await prisma.banner.findMany({
    where: {
      status: true,
    },
  });

  return (
    <main>
      <Navbar></Navbar>
      <BannerImage dataBanners={dataBanners}></BannerImage>
      <div className="flex mx-auto w-8/10 mt-20">
        <CardList dataProducts={dataProducts.slice(0, 9)} />
        {/* <Link href={"/product"}>See More Product</Link> */}
      </div>
      <div className="w-full flex justify-center mt-5">
        <Link href={"/product"}>
          <Button variant={"link"} className="font-bold">
            See More Product
          </Button>
        </Link>
      </div>
      <Footer></Footer>
    </main>
  );
}
