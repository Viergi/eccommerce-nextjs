import { NextResponse } from "next/server";
import { getProductById } from "@/lib/product/queries";
import { deleteProduct, updateProduct } from "@/lib/product/mutation";
import { isDemoMode } from "@/lib/utils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const response = await getProductById(id);

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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = request.headers.get("X-User-Id");
  const role = request.headers.get("X-Role");
  if (!userId) {
    return NextResponse.json(
      { errors: [{ message: "User ID is required" }] },
      { status: 400 }
    );
  }

  if (role !== "Admin" && role !== "SuperAdmin") {
    return NextResponse.json(
      { errors: "Access denied: Insufficent permissions." },
      { status: 403 }
    );
  }
  const { id } = await params;
  const body = await request.json();
  console.log(body, "Ini adalah body");
  const response = await updateProduct({ data: body, id });
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // cek mode
  if (isDemoMode())
    return NextResponse.json(
      { errors: "DEMO MODE: CAN'T CHANGE" },
      { status: 500 }
    );

  const userId = request.headers.get("X-User-Id");
  const role = request.headers.get("X-Role");
  if (!userId) {
    return NextResponse.json(
      { errors: [{ message: "User ID is required" }] },
      { status: 400 }
    );
  }

  if (role !== "Admin" && role !== "SuperAdmin") {
    return NextResponse.json(
      { errors: "Access denied: Insufficent permissions." },
      { status: 403 }
    );
  }

  const { id } = await params;
  const response = await deleteProduct(id);
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
