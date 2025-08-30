import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prismaClient"; // Sesuaikan path ke Prisma Anda
import { getSession } from "@/lib/session"; // Sesuaikan path ke fungsi getSession Anda
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { formatRupiah, formatWaktu } from "@/lib/convert";

// Ini adalah Server Component
export default async function UserOrdersPage() {
  const session = await getSession();

  // Redirect jika user belum login
  if (!session || !session.id) {
    redirect("/login");
  }

  // Ambil semua pesanan untuk pengguna yang sedang login
  const orders = await prisma.order.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
    include: {
      orderItems: {
        include: {
          product: {
            select: { name: true, imageUrl: true, price: true },
          },
        },
      },
    },
  });

  return (
    <section className="container mx-auto p-4 lg:p-8 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="mb-6 flex items-center space-x-2">
          <Link href="/dashboard">
            <Button variant="ghost" className="p-2">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Kembali ke Dashboard
            </Button>
          </Link>
        </div>

        {/* Header Halaman */}
        <h1 className="text-4xl font-bold text-gray-900">Riwayat Pesanan</h1>

        {/* Daftar Semua Pesanan */}
        {orders.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600 text-lg">
              Anda belum memiliki pesanan.
            </p>
            <p className="text-gray-500 mt-2">Mulai belanja sekarang!</p>
            <Link href="/" className="mt-4 inline-block">
              <Button>Mulai Belanja</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card
                key={order.id}
                className="shadow-lg hover:shadow-xl transition-shadow duration-200"
              >
                <CardHeader className="border-b px-6 py-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl font-semibold">
                        Pesanan #{order.id.substring(0, 8)}...
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        {formatWaktu(order.createdAt)}
                      </p>
                    </div>
                    <p
                      className={`font-bold text-sm px-3 py-1 rounded-full ${
                        order.status === "PENDING"
                          ? "bg-orange-100 text-orange-500"
                          : order.status === "CANCELLED"
                          ? "bg-gray-100 text-red-500"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {order.status}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {order.orderItems.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <Image
                          width={100}
                          height={100}
                          unoptimized={true}
                          src={item.product.imageUrl || ""}
                          alt={item.product.name}
                          className="h-12 w-12 object-cover rounded-md"
                        />
                        <div className="flex-grow">
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-500">
                            {item.quantity} x {formatRupiah(item.product.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-lg font-bold">Total Pesanan:</p>
                    <p className="text-lg font-bold text-primary">
                      {formatRupiah(order.totalAmount)}
                    </p>
                  </div>
                  <div className="mt-4 text-right">
                    <Link href={`/order/konfirmasi/${order.id}`}>
                      <Button variant="outline">Lihat Detail</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
