/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import Cart from "./Cart";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { CartItem } from "@/lib/type";

export default function CartSheet({
  cartItems,
  user,
}: {
  cartItems: CartItem[] | null;
  user: any;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative">
          <ShoppingCart className="h-5 w-5 text-gray-700 cursor-pointer" />
          {cartItems?.length != 0 && (
            <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white rounded-full px-1">
              {cartItems?.length}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full md:w-140">
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
          <SheetDescription>Your Cart</SheetDescription>
          {user == null ? (
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
                <span className="text-2xl font-bold">
                  Oops, your cart is empty!
                </span>
                <br></br>
                Find your favorite items and start Browse.
              </span>
            </div>
          ) : (
            <Cart dataCart={cartItems}></Cart>
          )}
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
