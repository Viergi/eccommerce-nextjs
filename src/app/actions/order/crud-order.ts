"use server";

import { OrderStatusValues } from "@/components/Form/UpdateStatusModal";
import { createOrders, updateOrderById } from "@/lib/orders/mutation";
import { getSession } from "@/lib/session";
import { FormOrders } from "@/lib/type";
import { revalidatePath } from "next/cache";

export async function updateOrderAction({
  data,
  id,
}: {
  data: OrderStatusValues;
  id: string;
}) {
  const session = await getSession();
  if (!session) return { success: false, error: "Unathorized" };

  try {
    const response = await updateOrderById({ data, id });
    if (response && response.data) {
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

export async function createOrderAction({ data }: { data: FormOrders }) {
  const session = await getSession();
  if (!session) return { success: false, error: "Unathorized" };

  try {
    const response = await createOrders({ data, userId: session.id });
    if (response && response.data) {
      return { success: true, data: response.data };
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
