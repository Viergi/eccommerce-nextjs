import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prismaClient"; // Sesuaikan path ke Prisma Anda
import { getSession } from "@/lib/session"; // Sesuaikan path ke fungsi getSession Anda
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatRupiah, formatWaktu } from "@/lib/convert";
import LogOutButton from "@/components/commons/LogOutButton";
import { ChevronLeft } from "lucide-react";
import { getUserByIdWithOrderCount } from "@/lib/user/queries";
import UserForm from "@/components/Form/UserForm";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session || !session.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      username: true,
      email: true,
      nomorTelepon: true,
      orders: {
        take: 5, // Ambil 5 pesanan terbaru
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          totalAmount: true,
          status: true,
          createdAt: true,
          orderItems: {
            select: {
              quantity: true,
              product: {
                select: { name: true, imageUrl: true },
              },
            },
          },
        },
      },
    },
  });

  const dataUser = await getUserByIdWithOrderCount(session.id);

  // Jika user tidak ditemukan meskipun ada sesi (mungkin user dihapus)
  if (!user) {
    redirect("/login");
  }

  if (!dataUser.data) {
    return redirect("/login");
  }

  return (
    <section className="container mx-auto p-4 lg:p-8 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="mb-6 flex items-center space-x-2">
          <Link href="/">
            <Button variant="ghost" className="p-2">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Kembali ke Home
            </Button>
          </Link>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Dashboard Pengguna
        </h1>
        <p className="text-lg text-gray-700">
          Selamat datang kembali,{" "}
          <span className="font-semibold">{user.username}</span>!
        </p>

        <Card className="shadow-lg">
          <CardHeader className="flex justify-between">
            <CardTitle className="text-2xl font-bold">Informasi Akun</CardTitle>
            <LogOutButton role={session.role} />
          </CardHeader>
          <CardContent className="space-y-2">
            {/* <EditProfileForm user={dataUser.data} /> */}
            <UserForm user={dataUser.data} />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-2xl font-bold">
              Pesanan Terbaru
            </CardTitle>
            <Link href="/dashboard/orders">
              <Button variant="link" className="px-0">
                Lihat Semua
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {user.orders.length === 0 ? (
              <p className="text-gray-600 text-center py-4">
                Anda belum memiliki pesanan.
              </p>
            ) : (
              <div className="space-y-4">
                {user.orders.map((order) => (
                  <div
                    key={order.id}
                    className="border p-4 rounded-lg bg-gray-50"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-semibold">
                        Order ID:{" "}
                        <span className="font-normal text-sm text-gray-600">
                          {order.id.substring(0, 8)}...
                        </span>
                      </p>
                      <p
                        className={`font-bold text-sm ${
                          order.status === "PENDING"
                            ? "text-orange-500"
                            : order.status === "CANCELLED"
                            ? "text-gray-500"
                            : "text-green-600"
                        }`}
                      >
                        {order.status}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      {formatWaktu(order.createdAt)}
                    </p>
                    <Separator className="my-2" />
                    <div className="flex flex-wrap gap-x-4 text-sm text-gray-700">
                      {order.orderItems.map((item, index) => (
                        <span key={index}>
                          {item.quantity}x {item.product.name}
                          {index < order.orderItems.length - 1 && ", "}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <p className="font-bold text-lg">
                        Total: {formatRupiah(order.totalAmount)}
                      </p>
                      <Link href={`/order/konfirmasi/${order.id}`}>
                        <Button variant="link" className="px-0">
                          Lihat Detail
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
