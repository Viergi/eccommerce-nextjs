import { createSession } from "@/lib/session";
import { getUserByEmail } from "@/lib/user/queries";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const response = await getUserByEmail(body.email);

  if (response.errors)
    return NextResponse.json(
      { errors: response.errors },
      { status: response.status }
    );

  if (!response.data) return;
  const { passwordHash, ...dataUser } = response.data;

  const passwordMatch = await bcrypt.compare(body.password, passwordHash);

  if (!passwordMatch)
    return NextResponse.json({ errors: "Password wrong" }, { status: 400 });

  const token = await createSession({ id: response.data.id, role: "user" });

  return NextResponse.json(
    {
      data: dataUser,
      token: token,
    },
    { status: response.status }
  );
}
