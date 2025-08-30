import { deleteSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logout success" });
  await deleteSession();
  return response;
}
