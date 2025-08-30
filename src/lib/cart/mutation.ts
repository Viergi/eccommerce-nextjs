import { prisma } from "../prismaClient";
import { FormCartItem } from "../type";
import { cartSchema } from "../zodSchema";

export async function createCartItem({
  data,
  userId,
}: {
  data: FormCartItem;
  userId: string;
}) {
  const { productId, quantity } = data;

  // Previous steps:
  // 1. Validate form fields
  const validationResult = cartSchema.safeParse(data);

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

  const item = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!item) return { status: 400, errors: "Product not found" };

  if (quantity > item?.stock)
    return { status: 400, errors: "Quantity more than stock" };

  // 2. Prepare data for insertion into database
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      userId,
      productId,
    },
  });

  if (existingItem) {
    const response = await updateCartItems({
      data,
      id: existingItem.id,
      userId,
    });
    return response;
  }

  // 3. Insert the admin into the database or call an Library API
  const cartItem = await prisma.cartItem.create({
    data: {
      userId,
      productId,
      quantity,
    },
  });

  if (!cartItem) return { status: 500, errors: "Failed to add item to cart" };
  return { status: 201, data: cartItem };
}

export async function updateCartItems({
  data,
  id,
  userId,
}: {
  data: FormCartItem;
  id: string;
  userId: string;
}) {
  const { quantity, productId } = data;

  const existingItem = await prisma.cartItem.findFirst({
    where: {
      productId,
      id,
      userId,
    },
  });

  if (!existingItem) return { status: 404, errors: "Item not found" };

  const item = await prisma.cartItem.update({
    where: {
      id: existingItem.id,
    },
    data: {
      quantity,
    },
  });

  if (!item) return { errors: "Change data failed", status: 500 };
  return { data: item, status: 200 };
}

export async function deleteCartItem(id: string) {
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      id,
    },
  });

  if (!existingItem) return { status: 404, errors: "Item not found" };

  const item = await prisma.cartItem.delete({
    where: {
      id,
    },
  });

  if (!item) return { errors: "Delete data failed", status: 400 };
  return { data: item, status: 200 };
}

export async function deleteAllCartItems(userId: string) {
  const existingItems = await prisma.cartItem.findMany({
    where: {
      userId: userId,
    },
  });

  if (!existingItems) return { status: 404, errors: "Items Not Found" };

  const allItems = await prisma.cartItem.deleteMany({
    where: {
      userId: userId,
    },
  });

  if (!allItems) return { errors: "Delete data failed", status: 400 };
  return { data: allItems, status: 200 };
}
