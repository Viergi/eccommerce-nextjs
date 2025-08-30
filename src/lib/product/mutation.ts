import { FormEditProductValues } from "@/components/Form/EditFormProduct";
import { prisma } from "../prismaClient";
import { backendEditProductSchema, backendProductSchema } from "../zodSchema";
import { FormAddProductValues } from "@/components/Form/ProductForm";

export async function createProduct(data: FormAddProductValues) {
  const { name, description, category, image, price, status, stock } = data;

  // 1. Validate form fields
  const validationResult = backendProductSchema.safeParse(data);

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

  // 2. Prepare data for insertion into database

  // 3. Insert the admin into the database or call an Library API
  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      categoryId: category,
      stock,
      imageUrl: image,
      status,
    },
  });
  if (!product) return { status: 500, errors: "Failed create product" };
  return { status: 201, data: product };
}

export async function updateProduct({
  data,
  id,
}: {
  data: FormEditProductValues;
  id: string;
}) {
  const { name, description, category, image, price, status, stock } = data;

  console.log(image, "ini coyy gambar");

  const validationResult = backendEditProductSchema.safeParse(data);

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

  const product = await prisma.product.update({
    where: {
      id,
    },
    data: {
      name,
      description,
      price,
      stock,
      imageUrl: image,
      categoryId: category,
      status,
    },
  });

  if (!product) return { errors: "Change data failed", status: 500 };
  return { data: product, status: 200 };
}

export async function deleteProduct(id: string) {
  console.log(id);
  const product = await prisma.product.delete({
    where: {
      id,
    },
  });

  if (!product) return { errors: "Delete data failed", status: 500 };
  return { data: product, status: 200 };
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
