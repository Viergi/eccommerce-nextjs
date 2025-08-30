"use client";

import React from "react";
import { SheetClose, SheetFooter } from "../ui/sheet";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useAuthToken } from "@/lib/authHook";
import z from "zod";
import { frontendEditBannerSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Image from "next/image";
import { Banner } from "../commons/BannerImage";
import { updateBannerAction } from "@/app/actions/banner/crud-banner";
import { isDemoMode } from "@/lib/utils";

export type FormEditBannerValues = z.infer<typeof frontendEditBannerSchema>;

export default function EditBannerForm({ banner }: { banner?: Banner }) {
  const form = useForm<FormEditBannerValues>({
    mode: "onChange",
    resolver: zodResolver(frontendEditBannerSchema),
    defaultValues: {
      title: banner?.title || "",
      subtitle: banner?.subtitle || "",
      link: banner?.link || "",
      image: undefined,
      status: banner?.status || false,
    },
  });
  const { token } = useAuthToken();

  const onSubmit = async (data: FormEditBannerValues) => {
    // cek mode
    if (isDemoMode()) return toast.error("DEMO MODE: CAN'T CHANGE");

    const file = (data.image as unknown as FileList)?.[0] || null;

    let uploadedImageUrl: string | null = null;

    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const uploadResponse = await fetch("/api/products/images/upload", {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || "Gagal mengunggah gambar.");
        }

        const uploadResult = await uploadResponse.json();
        uploadedImageUrl = uploadResult.imageUrl;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        toast.error(`Gagal upload gambar`, err);
        return;
      }
    }

    const bannerData = {
      title: data.title,
      subtitle: data.subtitle,
      image: uploadedImageUrl || banner?.imageUrl,
      link: data.link,
      status: data.status,
    };

    if (!banner?.id) return toast.error("Something went wrong");

    toast.promise(updateBannerAction({ data: bannerData, id: banner?.id }), {
      loading: "Saving changes...",
      success: (res) => {
        if (!res.success) throw res;
        return "Banner edit successfully.";
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: (err: any) => err.error || "Fail adding data",
    });
    // toast.promise(
    //   fetch(`/api/banner/${banner?.id}`, {
    //     method: "PUT",
    //     body: JSON.stringify(bannerData),
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       "Content-Type": "application/json",
    //     },
    //   }).then(async (res) => {
    //     const result = await res.json();
    //     if (!res.ok) {
    //       throw new Error(result.error || "Something went wrong");
    //     }
    //     return result;
    //   }),
    //   {
    //     loading: "Saving changes...",
    //     success: () => "Banner edit successfully.",
    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     error: (err: any) => err.message || "Fail adding data",
    //   }
    // );
    // router.refresh();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid flex-col gap-4 px-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter title banner" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtitle</FormLabel>
              <FormControl>
                <Input placeholder="Enter subtitle banner" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link</FormLabel>
              <FormControl>
                <Input placeholder="Enter banner link" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <Image
                src={banner?.imageUrl || "https://placehold.co/600x400"}
                alt="Gambar Banner"
                unoptimized={true}
                width={100}
                height={100}
              ></Image>
              <FormControl>
                <Input
                  {...fieldProps}
                  type="file"
                  accept="image/*"
                  onChange={(event) => onChange(event.target.files)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(value === "true")}
                  defaultValue={String(field.value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Not Active</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" className="grow">
              Change
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </form>
    </Form>
  );
}
