import { deleteSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // ambil token dari header request.header()
  // const token = request.headers.get("accessToken");
  // console.log(token);
  await deleteSession();
  // tambahkan token ke blacklist jika perlu

  return NextResponse.json({ message: "Logout success" });
}
