import { createOrders } from "@/lib/orders/mutation";
import { getAllOrdersByUserId } from "@/lib/orders/queries";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const userId = request.headers.get("X-User-Id");
  if (!userId) {
    return NextResponse.json(
      { errors: [{ message: "User ID is required" }] },
      { status: 400 }
    );
  }
  const response = await getAllOrdersByUserId(userId);
  if (response.errors)
    return NextResponse.json(
      { errors: response.errors },
      { status: response.status }
    );

  return NextResponse.json(
    { data: response.data },
    { status: response.status }
  );
}

export async function POST(request: Request) {
  // data yang perlu 1.barang yang ada di cart 2.userId 3.address
  // createOrders
  const userId = request.headers.get("X-User-Id");

  if (!userId) {
    return NextResponse.json(
      { errors: [{ message: "User ID is required" }] },
      { status: 400 }
    );
  }

  const body = await request.json();
  const response = await createOrders({
    data: body,
    userId,
  });

  if (response.errors)
    return NextResponse.json(
      { errors: response.errors },
      { status: response.status }
    );

  return NextResponse.json(
    { data: response.data },
    { status: response.status }
  );
}
