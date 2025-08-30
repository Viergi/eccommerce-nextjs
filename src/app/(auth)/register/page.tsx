import React from "react";
import RegisterForm from "@/components/Form/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="p-4 lg:pt-20 ">
      <div className="pt-10 max-w-[700px] mx-auto lg:p-8 lg:border lg:rounded-lg ">
        <h1 className="font-bold">Daftar Akun</h1>
        <RegisterForm />
        <p className="text-sm text-muted-foreground mt-2 text-center">
          Sudah punya akun ? Login{" "}
          <Link className="underline font-bold" href={"/login"}>
            disini
          </Link>
        </p>
      </div>
    </div>
  );
}
