/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcryptjs";
import { prisma } from "../prismaClient";
import { userRegisterSchema } from "../zodSchema";
import { FormRegisterValues } from "@/components/Form/RegisterForm";
import { FormEditUserValues } from "@/components/Form/UserForm";

export async function createUser(data: FormRegisterValues) {
  const { username, password, email, nomorTelepon } = data;
  // 1. Validate form fields
  const validationResult = userRegisterSchema.safeParse(data);

  if (!validationResult.success) {
    const messages = validationResult.error.issues.reduce((acc, err) => {
      acc[err.path[0] as string] = err.message;
      return acc;
    }, {} as Record<string, string>);
    return {
      status: 400,
      errors: messages,
    };
  }
  const existingCustomer = await prisma.user.findUnique({
    where: { username },
  });
  if (existingCustomer)
    return { status: 400, errors: "Username sudah dipakai" };

  const existingEmail = await prisma.user.findUnique({
    where: { email },
  });
  if (existingEmail) return { status: 400, errors: "Email sudah dipakai" };

  // 2. Prepare data for insertion into database
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Insert the user into the database or call an Library API
  const user = await prisma.user.create({
    data: {
      username: username.toLowerCase().trim(),
      email,
      passwordHash: hashedPassword,
      nomorTelepon: nomorTelepon,
    },
    select: {
      id: true,
      username: true,
      email: true,
      nomorTelepon: true,
    },
  });
  if (!user) return { status: 500, errors: "Failed create account" };
  return { status: 201, data: user };
}

export async function updateUser({
  id,
  data,
}: {
  id: string;
  data: FormEditUserValues;
}) {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...data,
        username: data.username?.toLowerCase(),
        email: data.email?.toLowerCase(),
      },
    });
    return { status: 200, data: user };
  } catch (err: any) {
    if (err.code === "P2002") {
      return { status: 400, errors: `${err.meta?.target} already in use` };
    }
    if (err.code === "P2025") {
      return { status: 404, errors: "User not found" };
    }
    return { status: 500, errors: "Failed to update account" };
  }
}
