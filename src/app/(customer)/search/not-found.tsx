import Image from "next/image";

export default async function NotFound() {
  return (
    <div className="w-full flex flex-col items-center justify-center max-h-screen">
      <Image
        src={"/not-found-animate.png"}
        width={100}
        height={100}
        unoptimized={true}
        alt="Product Not Found"
        className="object-cover aspect-square w-40 h-40 md:w-120 md:h-120"
      ></Image>
      <div className="text-center mt-10">
        <h1 className="text-2xl font-bold">Produk tidak ditemukan.</h1>
        <p className="text-gray-500">Coba cari dengan kata kunci lain.</p>
      </div>
    </div>
  );
}
