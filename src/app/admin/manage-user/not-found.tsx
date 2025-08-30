import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function NotFound() {
  return (
    <div className="w-full flex flex-col justify-center max-h-screen">
      <Link href="/admin/manage-user">
        <Button variant="ghost" className="p-2">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Kembali ke management user
        </Button>
      </Link>
      {/* <Image
        src={"/not-found-animate.png"}
        width={100}
        height={100}
        unoptimized={true}
        alt="Product Not Found"
        className="object-cover aspect-square w-120 h-120"
      ></Image> */}
      <div className="w-full flex justify-center items-center">
        <h2 className="text-2xl font-bold mt-4">User not found 404</h2>
      </div>
    </div>
  );
}
