/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { randomUUID } from "crypto";

// Konfigurasi Cloudinary dari environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  const role = request.headers.get("X-Role");
  if (role !== "Admin" && role !== "SuperAdmin") {
    return NextResponse.json(
      { errors: "Access denied: Insufficent permissions." },
      { status: 403 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("image");

    // Cek apakah file ada dan bertipe File
    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "Tidak ada file yang diunggah." },
        { status: 400 }
      );
    }

    // Ubah File menjadi Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // 1. Buat public_id unik
    const originalFilename = file.name
      .split(".")[0]
      .replace(/ /g, "-")
      .toLowerCase();
    const publicId = `${originalFilename}-${randomUUID()}`;
    // 2. Tentukan transformasi berdasarkan ukuran file
    const MAX_FILE_SIZE_MB = 5 * 1024 * 1024;
    const fileSize = file.size;
    let transformations = {};

    if (fileSize > MAX_FILE_SIZE_MB) {
      console.log("hai ini kepanggil", fileSize);
      transformations = { quality: "auto", fetch_format: "auto" };
    }

    // Unggah buffer ke Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "eco_shop",
            public_id: publicId, // Atur public_id di sini
            transformation:
              Object.keys(transformations).length > 0
                ? [transformations]
                : undefined,
          },
          (error: any, result: any) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(result);
          }
        )
        .end(buffer);
    });

    if (result && typeof result == "object" && "secure_url" in result) {
      return NextResponse.json(
        { imageUrl: result.secure_url },
        { status: 200 }
      );
    }

    throw new Error("Gagal mengunggah ke Cloudinary.");
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
