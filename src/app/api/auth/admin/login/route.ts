import { getAdminByEmail } from "@/lib/admin/queries";
import { createSession } from "@/lib/session";

import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const response = await getAdminByEmail(body.email);

  if (response.errors)
    return NextResponse.json(
      { errors: response.errors },
      { status: response.status }
    );

  if (!response.data)
    return NextResponse.json({ errors: "Login Failed" }, { status: 500 });

  if (response.data.level == "None")
    return NextResponse.json(
      { errors: "Account has not been verified" },
      { status: 400 }
    );

  const passwordMatch = await bcrypt.compare(
    body.password,
    response.data.passwordHash
  );

  if (!passwordMatch)
    return NextResponse.json({ errors: "Password wrong" }, { status: 400 });

  const session = await createSession({
    id: `${response.data.id}`,
    role: response.data.level,
  });
  return NextResponse.json(
    {
      data: response.data,
      token: session,
    },
    { status: response.status }
  );
}
