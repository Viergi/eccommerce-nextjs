import { createAdmin } from "@/lib/admin/mutation";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const response = await createAdmin(body);
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
