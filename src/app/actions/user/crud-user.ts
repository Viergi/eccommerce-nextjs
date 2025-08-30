"use server";
import { FormEditUserValues } from "@/components/Form/UserForm";
import { getSession } from "@/lib/session";
import { updateUser } from "@/lib/user/mutation";
import { revalidatePath } from "next/cache";

export async function updateUserAction({
  data,
  userId,
}: {
  userId: string;
  data: FormEditUserValues;
}) {
  const session = await getSession();
  if (!session) return { success: false, error: "Unathorized" };

  if (
    userId != session.id &&
    session.role != "Admin" &&
    session.role != "SuperAdmin"
  ) {
    return { success: false, error: "Access denied: Insufficent permissions." };
  }

  try {
    const response = await updateUser({ data, id: session.id });
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
