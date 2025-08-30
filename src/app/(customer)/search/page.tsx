import CardList from "@/components/commons/CardList";
import { getProductByName } from "@/lib/product/queries";
// import { notFound } from "next/navigation";
import React from "react";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const searchTerm = (await searchParams).q || "";
  // console.log(searchTerm, "ini search term");

  let dataProducts = null;

  // Lakukan pencarian hanya jika ada searchTerm
  if (searchTerm) {
    const response = await getProductByName(searchTerm);
    if (response?.data) {
      dataProducts = response.data;
    }
  }

  return (
    <section className="p-4 md:p-10 min-h-dvh">
      <h1 className="text-3xl font-bold mb-4">
        {/* Tampilkan judul yang berbeda jika tidak ada searchTerm */}
        {searchTerm ? `Hasil Pencarian untuk: "${searchTerm}"` : "Cari Produk"}
      </h1>

      {/* Tampilkan pesan jika tidak ada hasil */}
      {dataProducts && dataProducts.length === 0 && (
        <div className="text-center mt-10">
          <h1 className="text-2xl font-bold">Produk tidak ditemukan.</h1>
          <p className="text-gray-500">Coba cari dengan kata kunci lain.</p>
        </div>
      )}

      {/* Tampilkan CardList hanya jika ada produk yang ditemukan */}
      {dataProducts && dataProducts.length > 0 && (
        <CardList dataProducts={dataProducts}></CardList>
      )}

      {/* Tampilkan pesan default jika searchTerm kosong */}
      {!searchTerm && (
        <div className="text-center mt-10">
          <p className="text-gray-500">
            Silakan masukkan kata kunci untuk mencari produk.
          </p>
        </div>
      )}
    </section>
  );
}
