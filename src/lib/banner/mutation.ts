import { FormAddBannerValues } from "@/components/Form/BannerForm";
import { backendBannerSchema, backendEditBannerSchema } from "../zodSchema";
import { prisma } from "../prismaClient";
import { FormEditBannerValues } from "@/components/Form/EditBannerForm";

export async function createBanner(data: FormAddBannerValues) {
  const { title, subtitle, link, image, status } = data;
  console.log("Ini di mutation category", data);

  const validationResult = backendBannerSchema.safeParse(data);

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

  const banner = await prisma.banner.create({
    data: {
      title,
      subtitle,
      link,
      imageUrl: image,
      status,
    },
  });
  if (!banner) return { status: 500, errors: "Failed create banner" };
  return { status: 201, data: banner };
}

export async function updateBanner({
  data,
  id,
}: {
  data: FormEditBannerValues;
  id: string;
}) {
  const { image, link, status, subtitle, title } = data;

  const validationResult = backendEditBannerSchema.safeParse(data);

  if (!validationResult.success) {
    const errorArray = JSON.parse(validationResult.error.message) as {
      message: string;
    }[];
    const messages = errorArray.map((err) => err.message);
    return {
      status: 400,
      errors: messages,
    };
  }

  const banner = await prisma.banner.update({
    where: {
      id,
    },
    data: {
      title,
      subtitle,
      imageUrl: image,
      link,
      status,
    },
  });

  if (!banner) return { errors: "Change data failed", status: 500 };
  return { data: banner, status: 200 };
}

export async function deleteBanner(id: string) {
  const totalBanners = await prisma.banner.count();

  if (totalBanners == 1)
    return {
      errors: "You can't delete the banner if there's only 1 left.",
      status: 400,
    };

  const banner = await prisma.banner.delete({
    where: {
      id,
    },
  });
  if (!banner) return { errors: "Delete data failed", status: 500 };
  return { data: banner, status: 200 };
}
