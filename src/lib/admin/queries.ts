/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "../prismaClient";

export async function getAllAdmin() {
  try {
    //pake select
    const result = await prisma.admin.findMany({
      select: {
        id: true,
        username: true,
        email: true,
      },
    });
    return { status: 200, data: result };
  } catch (error) {
    return { status: 500, errors: "Fetching Error" };
  }
}

export async function getAdminById(id: number) {
  const result = await prisma.admin.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      username: true,
      fullname: true,
      nomorTelepon: true,
    },
  });
  if (!result) return { status: 404, errors: "Not Found" };
  return { status: 200, data: result };
}

export async function getAdminByEmail(email: string) {
  const result = await prisma.admin.findUnique({
    where: {
      email,
    },
  });

  if (!result) return { status: 404, errors: "Admin Not Found" };
  return { status: 200, data: result };
}
