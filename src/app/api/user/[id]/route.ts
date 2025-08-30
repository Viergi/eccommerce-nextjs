import { updateUser } from "@/lib/user/mutation";
import { getUserById } from "@/lib/user/queries";
import { NextResponse } from "next/server";

export async function GET(
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

  // request bukan dari admin
  if (role !== "Admin" && role !== "SuperAdmin") {
    return NextResponse.json(
      { errors: "Access denied: Insufficent permissions." },
      { status: 403 }
    );
  }

  const { id } = await params;

  // misal user nyari user lain
  if (id != userId) {
    return NextResponse.json(
      { errors: [{ message: "Access denied: Insufficent permissions." }] },
      { status: 403 }
    );
  }

  const response = await getUserById(id);
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
  const { id } = await params;

  if (!userId) {
    return NextResponse.json(
      { errors: "User ID is required" },
      { status: 400 }
    );
  }

  if (userId != id && role != "Admin" && role != "SuperAdmin") {
    return NextResponse.json(
      { errors: "Access denied: Insufficent permissions." },
      { status: 403 }
    );
  }

  const body = await request.json();
  console.log(body);
  const response = await updateUser({ id, data: body });

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
