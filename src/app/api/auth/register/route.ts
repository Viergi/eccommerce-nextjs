import { createSession } from "@/lib/session";
import { createUser } from "@/lib/user/mutation";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const response = await createUser(body);
  if (response.errors) {
    return NextResponse.json(
      { errors: response.errors },
      { status: response.status }
    );
  }

  if (!response.data)
    return NextResponse.json(
      { errors: "Failed something went wrong" },
      { status: 500 }
    );

  const session = await createSession({ id: response.data.id, role: "user" });

  return NextResponse.json(
    { data: response.data, token: session },
    { status: response.status }
  );
}
