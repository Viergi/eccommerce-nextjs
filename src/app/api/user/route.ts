import { getAllUsers } from "@/lib/user/queries";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const role = request.headers.get("X-Role");

  if (role !== "Admin" && role !== "SuperAdmin") {
    return NextResponse.json(
      { errors: "Access denied: Insufficent permissions." },
      { status: 403 }
    );
  }

  const response = await getAllUsers();
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
