import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { z } from "zod";
import { CreateInvoiceRequest, Invoice } from "xendit-node/invoice/models";
// import xenditClient from "@/lib/xendit-init";
import xenditInvoiceClient from "@/lib/xendit-init";

const createInvoiceSchema = z.object({
  orderId: z.uuid("ID pesanan tidak valid."),
});

const WEB_URL = process.env.WEB_URL;

export async function POST(request: Request) {
  const userId = request.headers.get("X-User-Id");
  if (!userId) {
    return NextResponse.json(
      { errors: [{ message: "User ID is required" }] },
      { status: 400 }
    );
  }
  const body = await request.json();
  const { orderId } = body;
  const validationResult = createInvoiceSchema.safeParse(body);

  if (!validationResult.success) {
    const messages = validationResult.error.issues.reduce((acc, err) => {
      acc[err.path[0] as string] = err.message;
      return acc;
    }, {} as Record<string, string>);
    return NextResponse.json(
      {
        errors: messages,
      },
      { status: 400 }
    );
  }

  // --- Cek apakah orderId valid dan statusnya masih 'pending' ---
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: {
        select: {
          email: true,
          username: true,
          nomorTelepon: true,
        },
      },
      orderItems: {
        include: {
          product: {
            select: {
              category: {
                select: {
                  name: true,
                },
              },
              name: true,
              imageUrl: true,
            },
          },
        },
      },
    },
  });

  if (!order || order.status !== "PENDING") {
    return NextResponse.json(
      {
        errors: "Pesanan tidak ditemukan atau sudah dibayar.",
      },
      { status: 404 }
    );
  }

  if (order.userId != userId) {
    return NextResponse.json(
      {
        errors: "Forbidden",
      },
      { status: 403 }
    );
  }

  // const invoiceId = `inv-${orderId}`;
  const items = order?.orderItems.map((item) => {
    return {
      name: item.product.name,
      quantity: item.quantity,
      price: item.priceAtOrder,
    };
  });

  const data: CreateInvoiceRequest = {
    externalId: orderId,
    amount: order.totalAmount,
    invoiceDuration: 86400,
    description: `Pembayaran ${order.user.username} di toko Eco Shop`,
    items: items,
    customer: {
      givenNames: order.user.username,
      mobileNumber: order.user.nomorTelepon,
      email: order.user.email,
    },
    currency: "IDR",
    successRedirectUrl: `${WEB_URL}/order/konfirmasi/${orderId}`,
    failureRedirectUrl: `${WEB_URL}/checkout`,
    fees: [{ type: "Delivery", value: 25000 }],
  };

  const response: Invoice = await xenditInvoiceClient.createInvoice({
    data,
  });

  if (!response)
    return NextResponse.json(
      { errors: [{ message: "Payment failed" }] },
      { status: 500 }
    );

  // console.error('Internal Server Error:', error);
  if (!order)
    return NextResponse.json(
      {
        message: "Terjadi kesalahan internal server.",
        errors: { general: "error" },
      },
      { status: 500 }
    );

  return NextResponse.json(
    {
      data: response,
    },
    { status: 201 }
  );
}
