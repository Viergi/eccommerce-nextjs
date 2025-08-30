"use client";

import React from "react";
import SearchForm from "../Form/SearchForm";
import { Menu, Search, ShoppingCart } from "lucide-react";
import CardList from "./CardList";
import { Banner, BannerImage } from "./BannerImage";

const date = new Date();

const mockDataProducts = [
  {
    id: "e9af3f20-1831-468e-aeb0-cce6db4fa7c0",
    name: "Baju Adat",
    description: "Baju Adat oke",
    price: 3000000,
    stock: 80,
    imageUrl: "https://placehold.co/600x400",
    categoryId: 1,
    createdAt: date,
    updatedAt: date,
    status: "publish",
  },
  {
    id: "0612bb5c-5a61-43e0-a49f-27fd786b49a1",
    name: "Sepatu",
    description: "asdqwe123",
    price: 40000,
    stock: 481,
    imageUrl: "https://placehold.co/600x400",
    categoryId: 2,
    createdAt: date,
    updatedAt: date,
    status: "publish",
  },
  {
    id: "0d75d0a7-476c-473d-844d-85175243de4c",
    name: "Sepatu sport",
    description: "sepatu sport",
    price: 40000,
    stock: 289,
    imageUrl: "https://placehold.co/600x400",
    categoryId: 2,
    createdAt: date,
    updatedAt: date,
    status: "publish",
  },
];

export default function BannerPreview({
  dataBanners,
}: {
  dataBanners: Banner[];
}) {
  const mobile = false;

  return (
    <section className="border-4 max-w-[650px] max-h-120 overflow-hidden rounded-lg relative">
      <div className="w-full h-full absolute z-60 bg-transparent right-0 top-0"></div>
      {/* Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo & Brand */}
            <div className="flex items-center gap-2">
              <Menu className="h-5 w-5 md:hidden" />
              <span className="text-xl font-bold text-primary">Eco Shop</span>
            </div>

            {/* Search */}
            <div className="hidden md:flex flex-1 mx-6 ">
              <div className="w-full relative">
                <div className="relative">
                  <div>
                    <input
                      type="text"
                      placeholder="Cari produk..."
                      className={`w-full rounded-md border border-gray-300 px-4 py-2 ${
                        !mobile && "pl-10"
                      } text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                    />
                    {!mobile && (
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              <ShoppingCart className="h-5 w-5 text-gray-700 cursor-pointer" />
              <>
                <span className="text-sm font-medium text-gray-700 hover:text-primary">
                  Masuk
                </span>
                <span className="text-sm font-medium text-primary border border-primary rounded-full px-3 py-1 hover:bg-primary hover:text-white transition">
                  Daftar
                </span>
              </>

              {/* {user && (
              <span
                className="flex gap-2 px-2 py-1 rounded-xl"
              >
                <span className="text-sm font-medium text-gray-700 hover:text-primary">
                  <CircleUser className="h-5 w-5 text-gray-700"></CircleUser>
                </span>
                <span className="text-sm font-medium text-gray-700 hover:text-primary">
                  {`user.username`}
                </span>
              </span>
            )} */}
            </div>
          </div>

          <div className="mt-2 md:hidden pb-4">
            <SearchForm mobile={true}></SearchForm>
          </div>
        </div>
      </header>
      {/* Banner */}
      <BannerImage dataBanners={dataBanners} preview={true}></BannerImage>

      {/* Card */}
      <div className="flex mx-auto w-8/10 mt-10">
        <CardList dataProducts={mockDataProducts} />
      </div>
    </section>
  );
}
