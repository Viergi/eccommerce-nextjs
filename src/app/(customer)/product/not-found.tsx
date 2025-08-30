import Image from "next/image";

export default async function NotFound() {
  return (
    <div className="w-full flex justify-center max-h-screen">
      <Image
        src={"/not-found-animate.png"}
        width={100}
        height={100}
        unoptimized={true}
        alt="Product Not Found"
        className="object-cover aspect-square w-120 h-120"
      ></Image>
    </div>
  );
}
