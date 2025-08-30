import { deleteBanner, updateBanner } from "@/lib/banner/mutation";
import { isDemoMode } from "@/lib/utils";
import { NextResponse } from "next/server";

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
  const response = await deleteBanner(id);
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
  const response = await updateBanner({ id, data: body });

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
