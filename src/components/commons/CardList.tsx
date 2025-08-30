import React from "react";
// import {
//   Card,
//   CardAction,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardImage,
//   CardPrice,
//   CardRating,
//   CardTitle,
// } from "../ui/card";
import { Product } from "@/lib/type";
// import formatRupiah from "@/lib/convert";
import { ProductCard } from "./Card";

export default function CardList({
  dataProducts,
}: {
  dataProducts: Product[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {dataProducts.map((item, index) => {
        return (
          <ProductCard
            key={index}
            description={item.description}
            imageUrl={item.imageUrl}
            name={item.name}
            price={item.price}
            id={item.id}
          />
          // <Card key={index} className="min-h-80 ">
          //   <CardImage src={item.imageUrl ? item.imageUrl : ""} />
          //   <CardHeader>
          //     <CardTitle>{item.name}</CardTitle>
          //     <CardPrice>{formatRupiah(item.price)}</CardPrice>
          //     <CardDescription>Dikirim dari Jakarta</CardDescription>
          //     <CardRating value={4.7} />
          //   </CardHeader>
          //   {/* <CardFooter className="py-0">
          //     <CardAction>Tambah ke Keranjang</CardAction>
          //   </CardFooter> */}
          // </Card>
        );
      })}
    </div>
  );
}
