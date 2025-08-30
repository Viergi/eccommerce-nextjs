"use server";

import { createCartItem } from "@/lib/cart/mutation";
import { getSession } from "@/lib/session";
import { FormCartItem } from "@/lib/type";
import { revalidatePath } from "next/cache";

export async function addItemToCart({
  data,
  userId,
}: {
  data: FormCartItem;
  userId: string;
}) {
  //! bikin validasi di sini
  const session = await getSession();
  if (!session) return { success: false, error: "Unathorized" };

  try {
    const response = await createCartItem({ data, userId });
    if (response && !response.errors) {
      revalidatePath("/");
      return { success: true };
    } else {
      return { success: false, error: response?.errors || "Update failed" };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
