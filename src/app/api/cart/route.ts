import { createCartItem, deleteAllCartItems } from "@/lib/cart/mutation";
import { getCartByUserId } from "@/lib/cart/queries";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const userId = request.headers.get("X-User-Id");

  if (!userId) {
    return NextResponse.json(
      { errors: "User ID is required" },
      { status: 400 }
    );
  }

  const response = await getCartByUserId(userId);
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
  const userId = request.headers.get("X-User-Id");
  const role = request.headers.get("X-Role");

  if (!userId) {
    return NextResponse.json(
      { errors: [{ message: "User ID is required" }] },
      { status: 400 }
    );
  }

  if (role !== "user") {
    return NextResponse.json(
      { errors: "Access denied: Insufficent permissions." },
      { status: 403 }
    );
  }

  const body = await request.json();
  const response = await createCartItem({
    data: body,
    userId,
  });

  // if (response.errors)
  //   return NextResponse.json(
  //     { errors: response.errors },
  //     { status: response.status }
  //   );

  if ("errors" in response) {
    return NextResponse.json(
      { errors: response.errors },
      { status: response.status }
    );
  }

  return NextResponse.json(
    { data: response.data },
    { status: response.status }
  );
}

export async function DELETE(request: Request) {
  const userId = request.headers.get("X-User-Id");
  const role = request.headers.get("X-Role");
  if (!userId) {
    return NextResponse.json(
      { errors: [{ message: "User ID is required" }] },
      { status: 400 }
    );
  }

  if (role !== "user") {
    return NextResponse.json(
      { errors: "Access denied: Insufficent permissions." },
      { status: 403 }
    );
  }

  const response = await deleteAllCartItems(userId);

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
