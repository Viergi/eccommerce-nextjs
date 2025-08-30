"use client";

import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useAuthToken } from "@/lib/authHook";

export default function PayButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const { token } = useAuthToken();
  const handlePayButton = async () => {
    const response = await fetch("/api/payment/create-transaction", {
      method: "POST",
      body: JSON.stringify({
        orderId: orderId,
      }),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const responseJson = await response.json();
    if (responseJson.errors) return router.refresh();
    router.push(responseJson.data.invoiceUrl);
  };

  return (
    <Button size="lg" className="w-full sm:w-auto" onClick={handlePayButton}>
      Bayar Pesanan
    </Button>
  );
}
