import LoginForm from "@/components/Form/LoginForm";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import React from "react";

export default function LoginPage() {
  return (
    <div className="p-4 lg:pt-40 ">
      <Card className="fixed z-50 p-4 right-2 top-4">
        <CardTitle>
          <h1>Login dengan akun DEMO</h1>
        </CardTitle>
        <CardDescription className="flex flex-col">
          <span>
            Email: <strong>user@demo.com</strong>
          </span>
          <span>
            Password: <strong>Demo@1234</strong>
          </span>
        </CardDescription>
      </Card>

      <div className="pt-18 max-w-[700px] mx-auto lg:p-8 lg:border lg:rounded-lg ">
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
