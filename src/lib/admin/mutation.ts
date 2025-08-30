import bcrypt from "bcryptjs";
import { prisma } from "../prismaClient";
import { adminRegisterSchema } from "../zodSchema";
import { FormEditAdminValues } from "@/components/Form/EditFormAdmin";
import { FormRegisterAdminValues } from "@/components/Form/RegisterFormAdmin";

export async function createAdmin(data: FormRegisterAdminValues) {
  const { username, password, email, nomorTelepon, fullname } = data;
  // console.log("Ini di mutation admin", data);

  // Previous steps:
  // 1. Validate form fields
  const validationResult = adminRegisterSchema.safeParse(data);

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

  const existingAdmin = await prisma.admin.findUnique({
    where: { username },
  });
  if (existingAdmin) return { status: 400, errors: "Username sudah dipakai" };

  const existingEmail = await prisma.admin.findUnique({
    where: { email },
  });
  if (existingEmail) return { status: 400, errors: "Email sudah dipakai" };

  // 2. Prepare data for insertion into database
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Insert the admin into the database or call an Library API
  const admin = await prisma.admin.create({
    data: {
      username: username.toLowerCase().trim(),
      email,
      passwordHash: hashedPassword,
      nomorTelepon,
      fullname,
    },
    select: {
      id: true,
      username: true,
      email: true,
      nomorTelepon: true,
      fullname: true,
    },
  });
  if (!admin) return { status: 500, errors: "Failed create admin account" };
  return { status: 201, data: admin };
}

export async function updateAdmin({
  data,
  id,
}: {
  data: FormEditAdminValues;
  id: number;
}) {
  const admin = await prisma.admin.update({
    where: {
      id,
    },
    data: {
      fullname: data.fullname,
      level: data.level,
      email: data.email,
      nomorTelepon: data.nomorTelepon,
    },
  });

  if (!admin) return { errors: "Change data failed", status: 500 };
  return { data: admin, status: 200 };
}

// export async function updateUser({id, data}) {
//   // Previous steps:
//   // 1. Validate form fields

//   const existingCustomer = await prisma.user.findUnique({
//     where: { username },
//   });

//   if (existingCustomer)
//     return { status: 400, errors: "Username sudah dipakai" };

//   const existingEmail = await prisma.user.findUnique({
//     where: { email },
//   });
//   if (existingEmail) return { status: 400, errors: "Email sudah dipakai" };

//   // 2. Prepare data for insertion into database
//   const hashedPassword = await bcrypt.hash(password, 10);

//   // 3. Insert the user into the database or call an Library API
//   const user = await prisma.user.create({
//     data: {
//       username,
//       email,
//       passwordHash: hashedPassword,
//       nomorTelepon: nomorTelepon,
//     },
//   });
//   if (!user) return { status: 500, errors: "Failed create account" };
//   return { status: 201, data };

// }
