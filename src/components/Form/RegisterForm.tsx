"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { useRouter } from "next/navigation";
import z from "zod";
import { userRegisterSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed, LoaderIcon } from "lucide-react";

export type FormRegisterValues = z.infer<typeof userRegisterSchema>;

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormRegisterValues>({
    resolver: zodResolver(userRegisterSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
      email: "",
      nomorTelepon: "",
    },
  });
  const [on, setOn] = useState<boolean>(false);
  const router = useRouter();

  const onSubmit: SubmitHandler<FormRegisterValues> = async (data) => {
    console.log("data:", data);
    const response = await fetch("api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        username: data.username,
        password: data.password,
        email: data.email,
        nomorTelepon: data.nomorTelepon,
      }),
    });

    const responseJson = await response.json();
    if (responseJson.errors) console.log("Error", responseJson.errors);
    router.push("admin/dashboard");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="pt-4 flex flex-col gap-2"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          {...register("username")}
          type="text"
          placeholder="Masukan username anda"
        />
        <div className="h-4 flex items-center px-3">
          {errors.username && (
            <p className="text-red-600 text-xs">{errors.username.message}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2 relative">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          {...register("password")}
          placeholder="Masukan password anda"
          type={on ? "text" : "password"}
        />
        <button
          onClick={() => setOn(!on)}
          type="button"
          aria-label={on ? "Sembunyikan password" : "Tampilkan password"}
          className="absolute right-2 bottom-7 hover:cursor-pointer"
        >
          {on ? <Eye></Eye> : <EyeClosed></EyeClosed>}
        </button>
        <div className="h-4 flex items-center px-3">
          {errors.password && (
            <p className="text-red-600 text-xs">{errors.password.message}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          {...register("email")}
          placeholder="Masukan email anda"
          type="email"
        />
        <div className="h-4 flex items-center px-3">
          {errors.email && (
            <p className="text-red-600 text-xs">{errors.email.message}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="nomorTelepon">Nomor Telepon</Label>
        <Input
          id="nomorTelepon"
          {...register("nomorTelepon")}
          placeholder="Masukan nomor telepon anda"
          type="number"
          className="[-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0"
        />
        <div className="h-4 flex items-center px-3">
          {errors.nomorTelepon && (
            <p className="text-red-600 text-xs">
              {errors.nomorTelepon.message}
            </p>
          )}
        </div>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <LoaderIcon className="animate-spin"></LoaderIcon>}
        Register
      </Button>
    </form>
  );
}
