import { notFound } from "next/navigation";
import { prisma } from "@/lib/prismaClient";
import { formatRupiah } from "@/lib/convert";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import UpdateStatusModal from "@/components/Form/UpdateStatusModal";

export const dynamic = "force-dynamic";

export default async function page({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const orderId = (await params).orderId;

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      user: {
        select: {
          username: true,
          email: true,
          nomorTelepon: true,
        },
      },
      orderItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              imageUrl: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    notFound();
  }
  return (
    <>
      <Link href="/admin/orders">
        <Button variant="ghost" className="p-2">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Kembali ke tabel orders
        </Button>
      </Link>
      <section className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            Detail Pesanan #{order.id.slice(0, 8)}
          </h1>
          {/* Mengganti komponen Badge dengan span dan Tailwind CSS */}
          <span
            className={`text-lg font-semibold px-2.5 py-0.5 rounded-full ${
              order.status === "PENDING"
                ? "text-orange-500 bg-orange-200"
                : order.status === "CANCELLED"
                ? "text-red-600 bg-red-200"
                : "text-green-600 bg-green-200"
            }`}
          >
            {order.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Kolom Kiri - Informasi Pelanggan & Pengiriman */}
          <div className="md:col-span-1 space-y-6">
            {/* Informasi Pelanggan */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Pelanggan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2">
                  <strong>Username:</strong> {order.user.username}
                </p>
                <p>
                  <strong>Email:</strong> {order.user.email}
                </p>
                <p>
                  <strong>Nomor Telepon:</strong> {order.user.nomorTelepon}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informasi Pengiriman</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2">
                  <strong>Alamat:</strong> {order.shippingAddress}
                </p>
                <p className="mb-2">
                  <strong>Payment Method:</strong> {order.paymentMethod}
                </p>
                <p>
                  <strong>Note:</strong> {order.notes ?? "-"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Kolom Kanan - Detail Produk & Pembayaran */}
          <div className="md:col-span-2 space-y-6">
            {/* Detail Produk */}
            <Card>
              <CardHeader>
                <CardTitle>Produk yang Dipesan</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produk</TableHead>
                      <TableHead className="text-right">Jumlah</TableHead>
                      <TableHead className="text-right">Harga Satuan</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.orderItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          <span
                          //   href={`/admin/products/${item.product.id}`}
                          //   className="text-blue-500 hover:underline"
                          >
                            {item.product.name}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatRupiah(item.priceAtOrder)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatRupiah(item.quantity * item.priceAtOrder)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Ringkasan Pembayaran */}
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Pembayaran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between font-medium">
                  <span>Subtotal:</span>
                  <span>{formatRupiah(order.totalAmount - 25000)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Biaya Kirim:</span>
                  <span>Rp25.000</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-2 border-t pt-2">
                  <span>Total:</span>
                  <span>{formatRupiah(order.totalAmount)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex gap-4">
                <UpdateStatusModal status={order.status} id={order.id} />
                {/* <Button>Ubah Status</Button> */}
                <Button variant="outline">Cetak Faktur</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
