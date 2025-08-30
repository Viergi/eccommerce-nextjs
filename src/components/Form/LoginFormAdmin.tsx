"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { useRouter } from "next/navigation";
import { useAuthToken } from "@/lib/authHook";
import { toast } from "sonner";
import z from "zod";
import { loginSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed, LoaderIcon } from "lucide-react";

type FormLoginAdminValues = z.infer<typeof loginSchema>;

export default function LoginFormAdmin() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormLoginAdminValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  const { saveToken } = useAuthToken();
  const [on, setOn] = useState<boolean>(false);

  const onSubmit = async (data: FormLoginAdminValues) => {
    const response = await fetch("/api/auth/admin/login", {
      method: "POST",
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });
    const responseJson = await response.json();
    if (responseJson.errors) return toast.error("Email or Password wrong");

    saveToken(responseJson.token);
    router.push("/admin/dashboard");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="pt-4 flex flex-col gap-2"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          {...register("email")}
          type="text"
          placeholder="Masukan email anda"
        />
        <div className="h-4 flex items-center px-3">
          {errors.email && (
            <p className="text-red-600 text-xs">{errors.email.message}</p>
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
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <LoaderIcon className="animate-spin"></LoaderIcon>}
        Login
      </Button>
    </form>
  );
}
