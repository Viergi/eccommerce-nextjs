import { getAllAdmin } from "@/lib/admin/queries";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const role = request.headers.get("X-Role");
  if (role !== "SuperAdmin" && role !== "Admin") {
    return NextResponse.json({ errors: "Forbidden" }, { status: 403 });
  }
  const response = await getAllAdmin();
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

// export async function PUT(request: Request) {
//   const session = await getSession();
//   if (session?.role !== "SuperAdmin")
//     return NextResponse.json({ errors: "Unauthorized" }, { status: 401 });

//   const body = await request.json();
//   console.log(body);
//   // const response = await updateAdmin({})
// }
