"use server";

import { FormEditBannerValues } from "@/components/Form/EditBannerForm";
import { updateBanner } from "@/lib/banner/mutation";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function updateBannerAction({
  data,
  id,
}: {
  id: string;
  data: FormEditBannerValues;
}) {
  const session = await getSession();
  if (!session) return { success: false, error: "Unathorized" };

  if (session.role != "Admin" && session.role != "SuperAdmin") {
    return { success: false, error: "Access denied: Insufficent permissions." };
  }

  try {
    const response = await updateBanner({ data, id });
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
