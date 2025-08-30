import UserForm from "@/components/Form/UserForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatWaktu } from "@/lib/convert";
import { getUserByIdWithOrderCount } from "@/lib/user/queries";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const userId = (await params).userId;
  const user = await getUserByIdWithOrderCount(userId);

  //   console.log(user);
  if (!user.data) return notFound();
  const { data } = user;

  return (
    <section className="flex flex-col gap-4">
      <Link href="/admin/manage-user">
        <Button variant="ghost" className="p-2">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Kembali ke tabel user
        </Button>
      </Link>
      <div className="flex gap-2 items-baseline">
        <h1 className="text-2xl">Informasi user</h1>
        <Badge>{data.username}</Badge>
      </div>
      <UserForm user={user.data}></UserForm>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Informasi Tambahan</CardTitle>
          <Separator className="mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Baris Tanggal Bergabung */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Tanggal Bergabung:</span>
            <span className="font-semibold text-foreground">
              {formatWaktu(data.createdAt)}
            </span>
          </div>

          <Separator />

          {/* Baris Jumlah Pesanan */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Jumlah Pesanan:</span>
            <Badge variant="secondary" className="font-semibold">
              {data.orderCount} Pesanan
            </Badge>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
