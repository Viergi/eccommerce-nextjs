import React from "react";
import Link from "next/link";
import RegisterFormAdmin from "@/components/Form/RegisterFormAdmin";

export default function Page() {
  return (
    <div className="p-4 lg:pt-20 ">
      <div className="pt-10 max-w-[700px] mx-auto lg:p-8 lg:border lg:rounded-lg ">
        <h1 className="font-bold">Daftar Akun Admin</h1>
        <RegisterFormAdmin />
        <p className="text-sm text-muted-foreground mt-2 text-center">
          Sudah punya akun admin ? Login{" "}
          <Link className="underline font-bold" href={"/admin/login"}>
            disini
          </Link>
        </p>
      </div>
    </div>
  );
}
