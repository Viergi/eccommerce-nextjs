// const createProductSchema = z.object({
//   name: z.string().min(3, "Nama produk minimal 3 karakter."),
//   description: z.string().min(10, "Deskripsi produk minimal 10 karakter."),
//   price: z.number().positive("Harga harus angka positif."),
//   stock: z.number().int().min(0, "Stok tidak boleh negatif."),
//   imageUrl: z.string().url("URL gambar tidak valid.").optional().nullable(),
//   categoryId: z.string().uuid("ID kategori tidak valid."),
// });

import { createProduct } from "@/lib/product/mutation";
import { getAllProducts, getProductByName } from "@/lib/product/queries";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("q");

  let response;
  if (searchTerm) {
    // Jika ada query parameter 'q', lakukan filtering
    response = await getProductByName(searchTerm);
  } else {
    response = await getAllProducts();
  }

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

  if (role !== "Admin" && role !== "SuperAdmin") {
    return NextResponse.json(
      { errors: "Access denied: Insufficent permissions." },
      { status: 403 }
    );
  }

  const body = await request.json();
  const response = await createProduct(body);

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
