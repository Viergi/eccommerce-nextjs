"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { useRouter } from "next/navigation";
import z from "zod";
import { adminRegisterSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed, LoaderIcon } from "lucide-react";

export type FormRegisterAdminValues = z.infer<typeof adminRegisterSchema>;

export default function RegisterFormAdmin() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormRegisterAdminValues>({
    resolver: zodResolver(adminRegisterSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
      fullname: "",
      email: "",
      nomorTelepon: "",
    },
  });
  const router = useRouter();
  const [on, setOn] = useState<boolean>(false);

  const onSubmit = async (data: FormRegisterAdminValues) => {
    const response = await fetch("/api/auth/admin/register", {
      method: "POST",
      body: JSON.stringify({
        username: data.username,
        password: data.password,
        fullname: data.fullname,
        email: data.email,
        nomorTelepon: data.nomorTelepon,
      }),
    });
    const responseJson = await response.json();
    if (responseJson.errors) return alert(`Error: ${responseJson.errors}`);

    alert(
      responseJson.message ||
        "Akun admin berhasil dibuat dan menunggu verifikasi"
    );

    router.push("/admin/login");
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
        <Label htmlFor="fullname">Full Name</Label>
        <Input
          id="fullname"
          {...register("fullname")}
          placeholder="Masukan Nama anda"
          type="text"
        />
        <div className="h-4 flex items-center px-3">
          {errors.fullname && (
            <p className="text-red-600 text-xs">{errors.fullname.message}</p>
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
