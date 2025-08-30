import { prisma } from "../prismaClient";
import { FormCategories } from "../type";
import { categorySchema } from "../zodSchema";

export async function createCategory(data: FormCategories) {
  const { name, description } = data;
  console.log("Ini di mutation category", data);

  // Previous steps:
  // 1. Validate form fields
  const validationResult = categorySchema.safeParse(data);

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
  const existingSoftDeletedCategory = await prisma.category.findFirst({
    where: {
      name,
      NOT: { deletedAt: null }, // Kategori yang deletedAt-nya TIDAK null (sudah di-soft delete)
    },
  });

  if (existingSoftDeletedCategory) {
    const restoredCategory = await prisma.category.update({
      where: { id: existingSoftDeletedCategory.id },
      data: {
        deletedAt: null, // Set kembali ke null
        description: description, // Opsional: update deskripsi juga jika ada perubahan
      },
    });
    return { status: 201, data: restoredCategory };
  }

  // 3. Insert the admin into the database or call an Library API
  const category = await prisma.category.create({
    data: {
      name,
      description,
    },
  });
  if (!category) return { status: 500, errors: "Failed create category" };
  return { status: 201, data: category };
}

export async function updateCategory({
  data,
  id,
}: {
  data: FormCategories;
  id: number;
}) {
  const { name, description } = data;

  const category = await prisma.category.update({
    where: {
      id,
    },
    data: {
      name,
      description,
    },
  });

  if (!category) return { errors: "Change data failed", status: 500 };
  return { data: category, status: 200 };
}

export async function deleteCategory(id: number) {
  const category = await prisma.category.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });

  // const product = await prisma.product.updateMany({
  //   where: { categoryId: id },
  //   data: { categoryId:  },
  // });

  // if (!product) return { errors: "Delete data failed", status: 500 };
  if (!category) return { errors: "Delete data failed", status: 500 };
  return { data: category, status: 200 };
}
