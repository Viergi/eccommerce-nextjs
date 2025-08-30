"use client";

import React from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatRupiah } from "@/lib/convert";
import Image from "next/image";
import { CartItem, User } from "@/lib/type";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "sonner";
import { checkoutFormSchema } from "@/lib/zodSchema";
import { createOrderAction } from "@/app/actions/order/crud-order";
import { Textarea } from "../ui/textarea";

// Definisikan tipe form dari skema Zod
export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export default function CheckoutForm({
  cartItems,
  dataUser,
}: {
  cartItems: CartItem[];
  dataUser: User;
}) {
  const router = useRouter();
  const { handleSubmit, register } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: dataUser.username,
      address: dataUser.address || "",
      notes: "",
    },
  });

  const subtotal = cartItems?.reduce(
    (acc: number, item: CartItem) => acc + item.product.price * item.quantity,
    0
  );
  const shippingFee = 25000; // Contoh biaya pengiriman tetap
  const total = (subtotal || 0) + shippingFee;

  // const onSubmit = async (data: CheckoutFormValues) => {
  //   console.log(data);
  //   const response = await fetch("/api/orders", {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //     body: JSON.stringify({
  //       // name: data.name,
  //       shippingAddress: data.address,
  //       notes: data.notes,
  //       // paymentMethod: data.paymentMethod,
  //       cartItems, // Data cartItems yang sudah ada
  //     }),
  //   });
  //   const responseJson = await response.json();

  //   if (responseJson.errors) return toast.error("Failed pay");

  //   toast.success("Successfully");

  //   router.refresh();
  //   // ! catatan masih ada yang error disini: ketika push ke halaman order cart navbar tidak terefresh
  //   setTimeout(() => {
  //     router.push(`/order/konfirmasi/${responseJson.data.id}`);
  //   }, 500);
  // };

  const onSubmit = async (data: CheckoutFormValues) => {
    toast.promise(
      createOrderAction({
        data: { shippingAddress: data.address, notes: data.notes, cartItems },
      }).then(async (res) => {
        console.log(res);
        if (!res.success) {
          throw res;
        }
        return res;
      }),
      {
        loading: "Loading...",
        success: (res) => {
          router.push(`/order/konfirmasi/${res.data?.id}`);
          router.refresh();
          return "Order created 🎉🎉";
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
        error: (err: any) => {
          return "Order failed";
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid lg:grid-cols-3 gap-8"
    >
      {/* Kolom Kiri: Detail Pengiriman dan Pembayaran */}
      <div className="lg:col-span-2 space-y-8">
        {/* Bagian Review Pesanan */}
        <Card className="shadow-lg">
          <CardHeader className="font-semibold text-xl">
            Review Pesanan
          </CardHeader>
          <CardContent className="space-y-4">
            {cartItems?.map((item: CartItem) => (
              <div key={item.id} className="flex items-center space-x-4">
                <Image
                  unoptimized={true}
                  width={100}
                  height={100}
                  src={item.product.imageUrl || ""}
                  alt={item.product.name}
                  className="h-16 w-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-grow">
                  <p className="font-medium text-lg">{item.product.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatRupiah(item.product.price)} x {item.quantity}
                  </p>
                </div>
                <span className="text-lg font-bold">
                  {formatRupiah(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Bagian Informasi Pengiriman */}
        <Card className="shadow-lg">
          <CardHeader className="font-semibold text-xl">
            Informasi Pengiriman
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                type="text"
                id="name"
                placeholder="Nama Lengkap Anda"
                {...register("name")}
                required
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="address">Alamat Lengkap</Label>
              <Textarea
                className="px-2 resize-none border"
                rows={3}
                id="address"
                placeholder="Masukkan alamat pengiriman lengkap"
                {...register("address")}
                required
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="notes">Catatan (Opsional)</Label>
              <Textarea
                className="px-2 resize-none border"
                rows={3}
                id="notes"
                {...register("notes")}
                placeholder="Catatan tambahan untuk pesanan atau kurir"
              />
            </div>
          </CardContent>
        </Card>

        {/* Bagian Metode Pembayaran */}
        {/* <Card className="shadow-lg">
          <CardHeader className="font-semibold text-xl">
            Metode Pembayaran
          </CardHeader>
          <CardContent>
            <Controller
              name="paymentMethod"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  {...register("paymentMethod")}
                  className="space-y-4"
                  onChange={field.onChange}
                  defaultValue={field.value}
                >
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="bankTransfer" id="r1" />
                    <Label
                      htmlFor="r1"
                      className={`text-lg  ${
                        field.value == "bankTransfer" ? "" : "text-gray-400"
                      }`}
                    >
                      Transfer Bank
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="eWallet" id="r2" />
                    <Label
                      htmlFor="r2"
                      className={`text-lg  ${
                        field.value == "eWallet" ? "" : "text-gray-400"
                      }`}
                    >
                      e-Wallet (Belum Tersedia)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="cod" id="r3" />
                    <Label
                      htmlFor="r3"
                      className={`text-lg  ${
                        field.value == "cod" ? "" : "text-gray-400"
                      }`}
                    >
                      Cash on Delivery (COD)
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />
          </CardContent>
        </Card> */}
      </div>

      {/* Kolom Kanan: Ringkasan Pesanan & Tombol Checkout */}
      <div className="lg:col-span-1">
        <Card className="sticky top-20 shadow-lg">
          <CardHeader className="font-semibold text-xl">
            Ringkasan Belanja
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatRupiah(subtotal || 0)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Biaya Pengiriman</span>
              <span>{formatRupiah(shippingFee)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-xl">
              <span>Total</span>
              <span>{formatRupiah(total)}</span>
            </div>
            <Button type="submit" className="w-full text-lg py-6" size="lg">
              Checkout
            </Button>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
