import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { formatRupiah, formatWaktu } from "@/lib/convert";
import { getSession } from "@/lib/session";
import { getOrderDetails } from "@/lib/orders/queries";
import PayButton from "@/components/commons/PayButton";

// Fungsi Server Component untuk mengambil detail pesanan

// Komponen Halaman Konfirmasi Pesanan (Server Component)
export default async function Page({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const session = await getSession();
  const { orderId } = await params;

  // Redirect jika user belum login
  if (!session || !session.id) {
    redirect("/login");
  }
  const order = await getOrderDetails(orderId, session.id);
  // Jika pesanan tidak ditemukan, alihkan ke halaman 404
  if (!order) {
    notFound();
  }

  return (
    <section className="container mx-auto p-4 lg:p-8 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header Halaman */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-green-600 mb-2">
            Pesanan Berhasil Dibuat!
          </h1>
          <p className="text-lg text-gray-700">
            Terima kasih atas pesanan Anda. Berikut adalah detailnya.
          </p>
        </div>

        {/* Kartu Ringkasan Pesanan */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Ringkasan Pesanan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">ID Pesanan:</span>
              <span className="font-semibold">{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tanggal Pesanan:</span>
              <span className="font-semibold">
                {formatWaktu(order.createdAt)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span
                className={`font-bold ${
                  order.status === "PENDING"
                    ? "text-orange-500"
                    : order.status === "CANCELLED"
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {order.status}
              </span>
            </div>
            {(order.status == "PAID" || order.status == "COMPLETED") && (
              <div className="flex justify-between">
                <span className="text-gray-600">Metode Pembayaran:</span>
                <span className="font-semibold">{order.paymentMethod}</span>
              </div>
            )}
            <Separator className="my-4" />
            <div className="flex justify-between text-xl font-bold">
              <span>Total Pembayaran:</span>
              <span>{formatRupiah(order.totalAmount)}</span>
            </div>
            <Separator className="my-4" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Alamat Pengiriman:</h3>
              <p className="text-gray-700">{order.shippingAddress}</p>
              {order.notes && (
                <p className="text-sm text-gray-500 mt-1">
                  Catatan: {order.notes}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Kartu Detail Item Pesanan */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Item Pesanan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.orderItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 border-b pb-2 last:border-b-0 last:pb-0"
              >
                <Image
                  unoptimized={true}
                  width={100}
                  height={100}
                  src={item.product.imageUrl || ""}
                  alt={item.product.name}
                  className="h-16 w-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-grow">
                  <p className="font-medium text-lg">{item.product.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatRupiah(item.product.price)} x {item.quantity}
                  </p>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold">
                    {formatRupiah(item.product.price * item.quantity)}
                  </span>
                  {order.status == "COMPLETED" && (
                    <Button
                      variant={"link"}
                      className="p-0 m-0 text-xs justify-end"
                    >
                      <Link href={`/product/${item.id}`} className="p-0">
                        Beri Ulasan
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Tombol Aksi Bawah */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Link href="/dashboard/orders">
            <Button size="lg" variant={"outline"} className="w-full sm:w-auto">
              Riwayat Pesanan
            </Button>
          </Link>
          {/* Asumsi ada halaman riwayat pesanan */}
          {order.status == "PENDING" && <PayButton orderId={orderId} />}
        </div>
      </div>
    </section>
  );
}
