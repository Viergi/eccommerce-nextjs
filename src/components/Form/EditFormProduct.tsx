"use client";

import React from "react";
import { SheetClose, SheetFooter } from "../ui/sheet";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useRouter } from "next/navigation";
import { Category, Product } from "@/lib/type";
import { toast } from "sonner";
import { useAuthToken } from "@/lib/authHook";
import { Combobox } from "../ui/combo-box";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { frontendEditProductSchema } from "@/lib/zodSchema";
import z from "zod";
import Image from "next/image";
import { formatNumber, formatRupiah, parseNumber } from "@/lib/convert";

export type FormEditProductValues = z.infer<typeof frontendEditProductSchema>;

export default function EditFormProduct({
  product,
  categories,
}: {
  product: Product;
  categories: Category[];
}) {
  const form = useForm<FormEditProductValues>({
    resolver: zodResolver(frontendEditProductSchema),
    mode: "onChange",
    defaultValues: {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.categoryId || 0,
      status: product.status as "publish" | "draft",
    },
  });
  const router = useRouter();
  const { token } = useAuthToken();

  const onSubmit = async (data: FormEditProductValues) => {
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

    toast.promise(
      fetch(`/api/products/${product.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          price: Number(data.price),
          stock: Number(data.stock),
          image: uploadedImageUrl || product.imageUrl,
          category: Number(data.category),
          status: data.status,
        }),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(async (res) => {
        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.error || "Something Went Wrong");
        }
        return result;
      }),
      {
        loading: "Saving changes...",
        success: () => {
          router.refresh();
          return "Data Product succesfully change.";
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error: (err: any) => err.message || "Fail changes data",
      }
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid flex-col gap-4 px-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <textarea
                  className="w-full resize-none p-2 border rounded-md"
                  placeholder="Enter product description"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="text" // Ganti type menjadi number
                  placeholder="Enter product price"
                  {...field}
                  value={formatRupiah(field.value || 0)}
                  onChange={(e) => field.onChange(parseNumber(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder={`${formatNumber(String(product.stock))}`}
                  {...field}
                  value={formatNumber(String(field.value))}
                  onChange={(e) => field.onChange(parseNumber(e.target.value))}
                />
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
                src={product.imageUrl || "https://placehold.co/600x400"}
                alt="Gambar Product"
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
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Combobox
                data={categories.map((category) => ({
                  value: String(category.id),
                  label: `${category.name}`,
                }))}
                value={String(field.value)}
                onChange={(selectedValued) => {
                  console.log("woi");
                  return field.onChange(Number(selectedValued));
                }}
                placeholder="Select Category"
              />
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
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="publish">Publish</SelectItem>
                    <SelectItem value="draft">Not Publish</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SheetFooter>
          <div className="flex gap-2">
            <Button type="submit" className="grow">
              Change
            </Button>
          </div>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </form>
    </Form>
  );
}
