/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prismaClient";

// Konfigurasi Cloudinary dari environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  // const role = request.headers.get("X-Role");
  // if (role !== "Admin" && role !== "SuperAdmin") {
  //   return NextResponse.json(
  //     { errors: "Access denied: Insufficent permissions." },
  //     { status: 403 }
  //   );
  // }

  try {
    const formData = await request.formData();
    const filesToUpload = formData.getAll("image");

    // Cek apakah file ada dan bertipe File
    if (!filesToUpload || typeof filesToUpload === "string") {
      return NextResponse.json(
        { error: "Tidak ada file yang diunggah." },
        { status: 400 }
      );
    }

    const files = Array.isArray(filesToUpload)
      ? filesToUpload
      : [filesToUpload];

    const uploadedImageUrls = [];

    for (const file of files) {
      // Ubah File menjadi Buffer
      const buffer = Buffer.from(await (file as Blob).arrayBuffer());

      // 1. Buat public_id unik
      const originalFilename = (file as File).name
        .split(".")[0]
        .replace(/ /g, "-")
        .toLowerCase();
      const publicId = `${originalFilename}-${randomUUID()}`;
      // 2. Tentukan transformasi berdasarkan ukuran file
      const MAX_FILE_SIZE_MB = 5 * 1024 * 1024;
      const fileSize = (file as File).size;
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

      console.log(result);

      if (
        result &&
        typeof result == "object" &&
        "secure_url" in result &&
        "public_id" in result
      ) {
        uploadedImageUrls.push({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }

      if (!result) {
        throw new Error("Gagal mengunggah ke Cloudinary.");
      }
    }

    return NextResponse.json({ imageUrl: uploadedImageUrls }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // !kasih auth

    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required." },
        { status: 400 }
      );
    }

    // Extract public ID from the image URL
    const publicId = imageUrl.split("/").pop().split(".")[0];

    console.log(publicId);

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(`eco_shop/${publicId}`);

    // Delete image from database
    await prisma.imageReview.delete({
      where: {
        publicId,
      },
    });

    return NextResponse.json(
      { message: "Image deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
