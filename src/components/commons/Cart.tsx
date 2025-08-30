"use client";

import { formatRupiah } from "@/lib/convert";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CartItem } from "@/lib/type";
import { SheetClose } from "../ui/sheet";
import { useAuthToken } from "@/lib/authHook";
import { Trash2 } from "lucide-react";

// export interface Product {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   stock: number;
//   imageUrl: string;
// }

export default function Cart({ dataCart }: { dataCart: CartItem[] | null }) {
  const { token } = useAuthToken();
  const router = useRouter();

  const handleDeleteCartItem = async (id: string) => {
    const response = await fetch(`/api/cart/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const responseJson = await response.json();
    if (!responseJson) return toast.error("Deleted failed");
    router.refresh();
  };

  const handleEmptyingCart = async () => {
    const response = await fetch("/api/cart", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const responseJson = await response.json();
    if (!responseJson) return toast.error("Deleted failed");
    router.refresh();
  };

  if (dataCart?.length == 0)
    return (
      <div className="w-full flex flex-col justify-center gap-2">
        <Image
          width={100}
          height={100}
          src={"/cart.png"}
          alt={"Cart Image"}
          unoptimized={true}
          className="object-cover w-full"
        ></Image>
        <span className="text-center font-light gap-2">
          <span className="text-2xl font-bold">Oops, your cart is empty!</span>
          <br></br>
          Find your favorite items and start Browsesss.
        </span>
      </div>
    );

  return (
    <>
      <ScrollArea className="h-90 lg:min-h-full">
        <div className="flex flex-col gap-2 ">
          {dataCart?.map((item: CartItem, index: number) => {
            return (
              <div
                key={index}
                className="border-2 shadow-sm py-3 px-3 rounded-xl flex justify-between"
              >
                <div className="flex flex-col">
                  <div className="flex gap-2 items-baseline">
                    <Link
                      href={`/product/${item.product.id}`}
                      className="font-semibold text-sm md:text-lg w-30 md:w-40 text-gray-900 truncate"
                    >
                      {item.product.name}
                    </Link>
                    <span className="text-sm">x{item.quantity}</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 w-30 md:w-40 truncate grow">
                    {item.product.description}
                  </p>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-black">
                      {formatRupiah(item.product.price)}
                    </span>
                    <Trash2
                      className="cursor-pointer"
                      onClick={() => handleDeleteCartItem(item.id)}
                    ></Trash2>
                  </div>
                </div>
                <div className="h-20 w-20 rounded-xl bg-gray-100 overflow-hidden">
                  <Image
                    draggable={false}
                    unoptimized={true}
                    width={100}
                    height={100}
                    src={item.product.imageUrl || ""}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
      <SheetClose asChild>
        <Link href={"/checkout"}>
          <Button className="mt-4 w-full">Check out</Button>
        </Link>
      </SheetClose>
      <Button variant={"destructive"} onClick={handleEmptyingCart}>
        Emptying the cart
      </Button>
    </>
  );
}
