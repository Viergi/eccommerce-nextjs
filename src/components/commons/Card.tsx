import * as React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { formatRupiah } from "@/lib/convert";
import Link from "next/link";

interface ProductCardProps {
  id: string;
  imageUrl: string | null;
  name: string;
  description: string;
  price: number;
  className?: string;
}

export function ProductCard({
  id,
  imageUrl,
  name,
  description,
  price,
  className,
}: ProductCardProps) {
  return (
    <Link
      href={`/product/${id}`}
      className={cn(
        "rounded-2xl overflow-hidden bg-white flex flex-col",
        className
      )}
    >
      <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden border">
        <Image
          draggable={false}
          unoptimized={true}
          width={100}
          height={100}
          src={imageUrl || ""}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="mt-4 px-2 flex flex-col gap-1">
        <h3 className="font-semibold text-sm text-gray-900">{name}</h3>
        <p className="text-sm text-gray-500 truncate">{description}</p>
        <span className="text-sm font-medium text-black mt-1">
          {formatRupiah(price)}
        </span>
      </div>
    </Link>
  );
}
