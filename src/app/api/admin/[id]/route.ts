import { updateAdmin } from "@/lib/admin/mutation";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const role = request.headers.get("X-Role");

  if (role !== "SuperAdmin") {
    return NextResponse.json({ errors: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { id } = await params;
  const response = await updateAdmin({ data: body, id: Number(id) });
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
