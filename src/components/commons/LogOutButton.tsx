"use client";
import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useAuthToken } from "@/lib/authHook";

export default function LogOutButton({ role }: { role?: string }) {
  const router = useRouter();
  const { removeToken } = useAuthToken();

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    removeToken();
    if (role == "user") {
      router.push("/login");
    }
    if (role == "Admin" || role == "SuperAdmin") {
      router.push("/admin/login");
    }
    // router.push("/login");
  };

  return <Button onClick={logout}>Log out</Button>;
}
