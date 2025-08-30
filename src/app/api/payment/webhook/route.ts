import { prisma } from "@/lib/prismaClient";
import { NextResponse } from "next/server";

const XENDIT_WEBHOOK_TOKEN = process.env.XENDIT_WEBHOOK_TOKEN;

export async function POST(request: Request) {
  if (!XENDIT_WEBHOOK_TOKEN) {
    console.error("Xendit Webhook Token is not set in environment variables.");
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }

  // 1. Ambil X-Callback-Token dari header permintaan
  const xCallbackToken = request.headers.get("x-callback-token");

  // 2. Bandingkan token yang diterima dengan token dari .env
  if (xCallbackToken !== XENDIT_WEBHOOK_TOKEN) {
    console.warn("Unauthorized webhook request. Invalid x-callback-token.");
    return NextResponse.json(
      { message: "Unauthorized TOKEN WEBHOOK" },
      { status: 401 }
    );
  }

  const body = await request.json();

  const { external_id, status, payment_method } = body;
  // logic ubah database dan data order jadi status paid
  const response = await prisma.order.update({
    where: {
      id: external_id,
    },
    data: {
      status: status,
      paymentMethod: payment_method,
    },
  });

  if (!response)
    return NextResponse.json(
      { data: "Failed update database" },
      { status: 500 }
    );

  return NextResponse.json({ data: response }, { status: 200 });
}
