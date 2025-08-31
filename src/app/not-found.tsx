import Image from "next/image";

export default async function NotFound() {
  return (
    <div className="w-full flex justify-center items-center border h-screen">
      <Image
        width={500}
        height={500}
        unoptimized={true}
        src={"/page-not-found.png"}
        alt="PAGE NOT FOUND 404"
      ></Image>
    </div>
  );
}
