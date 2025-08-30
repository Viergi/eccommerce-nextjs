import { deleteCartItem, updateCartItems } from "@/lib/cart/mutation";
// import { getCategoryById } from "@/lib/category/queries";
import { NextResponse } from "next/server";

// export async function GET(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   const { id } = await params;
//   const response = await getCategoryById(Number(id));

//   if (response.errors)
//     return NextResponse.json(
//       { errors: response.errors },
//       { status: response.status }
//     );

//   return NextResponse.json(
//     { data: response.data },
//     { status: response.status }
//   );
// }

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = request.headers.get("X-User-Id");
  const { id } = await params;

  if (!userId) {
    return NextResponse.json(
      { errors: [{ message: "User ID is required" }] },
      { status: 400 }
    );
  }

  const body = await request.json();
  const response = await updateCartItems({ data: body, id, userId });
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
  const { id } = await params;
  const response = await deleteCartItem(id);
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
