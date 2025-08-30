"use client"; // Tetap Client Component karena ada interaktivitas tombol

import { formatRupiah } from "@/lib/convert";
import { JWTPayload, Product } from "@/lib/type";
import { useRouter } from "next/navigation";
import { MouseEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { addItemToCart } from "@/app/actions/cart/crud-cart";

export default function ProductInfo({
  product,
  session,
}: {
  session?: JWTPayload | null;
  product: Product;
}) {
  const [quantity, setQuantity] = useState<number>(1); // Untuk pilih jumlah
  const [loading, setLoading] = useState<boolean>(false); // Untuk pilih jumlah
  const router = useRouter();

  const handleAddToCart = async (e: MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    e.preventDefault();
    if (!session?.id) return toast.error("Login terlebih dahulu");
    if (quantity > product.stock) return toast.error("Buying more than stock");
    toast.promise(
      addItemToCart({
        data: { quantity, productId: product.id },
        userId: session.id,
      }).then(async (res) => {
        if (!res.success) {
          throw res;
        }
        return res;
      }),
      {
        loading: "Saving changes...",
        success: () => "Product added to cart!",
        error: () => {
          return "Fail adding product";
        },
      }
    );
    setLoading(false);
  };

  const handleBuyNow = (e: MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    e.preventDefault();
    if (!session?.id) return toast.error("Login terlebih dahulu");
    if (quantity > product.stock) return toast.error("Buying more than stock");
    toast.promise(
      addItemToCart({
        data: { quantity, productId: product.id },
        userId: session.id,
      }).then(async (res) => {
        if (!res.success) {
          throw new Error("Something went wrong");
        }
        return res;
      }),
      {
        loading: "Saving changes...",
        success: () => {
          router.push("/checkout");
          return "Product added to cart!";
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error: (err: any) => err.message || "Fail adding product",
      }
    );
    setLoading(false);
  };

  return (
    <div className="md:w-1/2 flex flex-col justify-between">
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        {/* <p className="text-gray-600 text-sm mb-4">Kategori: {}</p> */}
        <p className="text-2xl font-semibold text-blue-600 mb-4">
          {formatRupiah(product.price)}
        </p>
        <div className="flex items-center space-x-4 mb-2">
          <span className="text-gray-500">Stok:</span>
          <Badge variant={product.stock > 0 ? "default" : "destructive"}>
            {product.stock > 0 ? `${product.stock} Tersedia` : "Habis"}
          </Badge>
        </div>
      </div>
      <div className="w-full flex flex-col ">
        <div className="mb-4 flex items-center space-x-3">
          <label className="block text-sm font-medium text-gray-700">
            Jumlah:
          </label>
          <button
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            className="px-3 py-1 border rounded-md bg-gray-100 hover:bg-black hover:text-white transition duration-300 hover:cursor-pointer "
          >
            ─
          </button>
          <input
            type="number"
            value={quantity}
            max={product.stock}
            onChange={(e) => {
              if (
                parseInt(e.target.value) > product.stock ||
                quantity > product.stock
              )
                return toast.error("Buying more than stock");
              setQuantity(Math.max(1, parseInt(e.target.value) || 1));
            }}
            className="w-16 text-center border rounded-md py-1 [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0"
            min="1"
          />
          <button
            onClick={() => setQuantity((prev) => prev + 1)}
            className="px-3 py-1 border rounded-md bg-gray-100 hover:bg-black hover:text-white transition duration-300 hover:cursor-pointer"
          >
            ✚
          </button>
        </div>
        <Button
          disabled={product.stock <= 0 || loading}
          onClick={handleAddToCart}
          className="w-full md:w-auto mb-2"
        >
          {loading ? "Loading..." : "Tambah ke Keranjang"}
        </Button>
        <Button
          disabled={product.stock <= 0 || loading}
          onClick={handleBuyNow}
          variant={"outline"}
          className="w-full md:w-auto border-2 border-black"
        >
          Beli Sekarang
        </Button>
      </div>
    </div>
  );
}
