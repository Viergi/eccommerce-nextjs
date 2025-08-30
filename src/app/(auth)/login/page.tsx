import LoginForm from "@/components/Form/LoginForm";
import Link from "next/link";
import React from "react";

export default function LoginPage() {
  return (
    <div className="p-4 lg:pt-40 ">
      <div className="pt-10 max-w-[700px] mx-auto lg:p-8 lg:border lg:rounded-lg ">
        <h1 className="font-bold">Login </h1>
        <LoginForm />
        <p className="text-sm text-muted-foreground mt-2 text-center">
          Belum punya akun ? register{" "}
          <Link className="underline font-bold" href={"/register"}>
            disini
          </Link>
        </p>
      </div>
    </div>
  );
}
