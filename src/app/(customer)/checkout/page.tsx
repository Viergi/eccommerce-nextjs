import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import CheckoutForm from "@/components/Form/CheckoutForm";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prismaClient";
import { redirect } from "next/navigation";
import { getUserByIdWithOrderCount } from "@/lib/user/queries";

export default async function CheckoutPage() {
  const session = await getSession();
  let dataCartItems = null;
  let dataUser = null;

  if (session) {
    const user = await getUserByIdWithOrderCount(session.id);

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: session?.id,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            imageUrl: true,
          },
        },
      },
    });
    dataUser = user;
    dataCartItems = cartItems || [];
  }

  if (!dataCartItems) return redirect("/");
  if (!dataUser?.data) return redirect("/");

  if (dataCartItems?.length == 0) {
    redirect("/");
  }

  return (
    <section className="container mx-auto p-4 lg:p-8 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center space-x-2">
          <Link href="/">
            <Button variant="ghost" className="p-2">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Kembali ke Beranda
            </Button>
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        {/* Layout utama dengan 2 kolom untuk desktop */}
        <CheckoutForm cartItems={dataCartItems} dataUser={dataUser.data} />
      </div>
    </section>
  );
}
