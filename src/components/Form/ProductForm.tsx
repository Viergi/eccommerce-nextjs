/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Category } from "@/lib/type";
import { useAuthToken } from "@/lib/authHook";
import { Combobox } from "../ui/combo-box";
import z from "zod";
import { frontendProductSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatNumber, formatRupiah, parseNumber } from "@/lib/convert";

export type FormAddProductValues = z.infer<typeof frontendProductSchema>;

export default function ProductForm({
  categories,
  setOpen,
}: {
  setOpen: (value: boolean) => void;
  categories: Category[];
}) {
  const form = useForm<FormAddProductValues>({
    mode: "onChange",
    resolver: zodResolver(frontendProductSchema),
    defaultValues: {
      name: "",
      price: 0,
      stock: 0,
      description: "",
      image: undefined,
      category: 0,
      status: "draft",
    },
  });
  // const [imageUrl, setImageUrl] = useState<string>("");
  const router = useRouter();
  const { token } = useAuthToken();

  // const onSubmit = async (data: FormAddProductValues) => {
  //   console.log(imageUrl);
  //   console.log(data, "ini");
  //   toast.promise(
  //     fetch(`/api/products`, {
  //       method: "POST",
  //       body: JSON.stringify({
  //         name: data.name,
  //         description: data.description,
  //         price: Number(data.price),
  //         stock: Number(data.stock),
  //         image: imageUrl,
  //         category: Number(data.category),
  //         status: data.status,
  //       }),
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }).then(async (res) => {
  //       const result = await res.json();
  //       if (!res.ok) {
  //         throw new Error(result.error || "Something went wrong");
  //       }
  //       return result;
  //     }),
  //     {
  //       loading: "Saving changes...",
  //       success: () => "Data Product succesfuly add.",
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //       error: (err: any) => err.message || "Fail adding data",
  //     }
  //   );
  //   router.refresh();
  // };

  const onSubmit = async (data: FormAddProductValues) => {
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
      } catch (err: any) {
        toast.error(`Gagal upload gambar`, err);
        return;
      }
    }

    const productData = {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      stock: Number(data.stock),
      image: uploadedImageUrl, // Gunakan URL gambar yang sudah diunggah
      category: Number(data.category),
      status: data.status,
    };

    toast.promise(
      fetch(`/api/products`, {
        method: "POST",
        body: JSON.stringify(productData),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).then(async (res) => {
        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.error || "Something went wrong");
        }
        return result;
      }),
      {
        loading: "Saving changes...",
        success: () => {
          setOpen(false);
          return "Data Product successfully added.";
        },
        error: (err: any) => err.message || "Fail adding data",
      }
    );

    // Setelah kedua proses (unggah dan simpan) selesai
    router.refresh();
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
                  type="text"
                  placeholder="Enter product price"
                  {...field}
                  value={formatRupiah(field.value)}
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
                  type="string"
                  placeholder="Enter stock quantity"
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
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
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
              <FormControl>
                <Combobox
                  data={categories.map((category) => ({
                    value: `${category.id}`,
                    label: `${category.name}`,
                  }))}
                  value={`${field.value}`}
                  onChange={(selectedValued) => {
                    return field.onChange(Number(selectedValued));
                  }}
                  placeholder="Select Category"
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
              Add
            </Button>
          </div>
          <SheetClose asChild onClick={() => setOpen(false)}>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </form>
    </Form>

    // <form onSubmit={handleSubmit(onSubmit)}>
    //   <div className="grid flex-col gap-4 px-4">
    //     <div className="flex flex-col gap-2">
    //       <Label htmlFor="name">Product Name</Label>
    //       <Input
    //         id="name"
    //         {...register("name", {
    //           required: { value: true, message: "Product name is required" },
    //         })}
    //         type="text"
    //         placeholder="Enter product name"
    //       />
    //     </div>

    //     <div className="flex flex-col gap-2">
    //       <Label htmlFor="description">Description</Label>
    //       <textarea
    //         id="description"
    //         {...register("description", {
    //           required: {
    //             value: true,
    //             message: "Product description is required",
    //           },
    //         })}
    //         className="w-full resize-none p-2"
    //         rows={4}
    //         placeholder="Enter product description"
    //       />
    //     </div>

    //     <div className="flex flex-col gap-2">
    //       <Label htmlFor="price">Price</Label>
    //       <Input
    //         id="price"
    //         {...register("price", {
    //           required: { value: true, message: "Price is required" },
    //           pattern: {
    //             value: /^[0-9]+$/,
    //             message: "Price must be a number",
    //           },
    //         })}
    //         type="number"
    //         placeholder="Enter product price"
    //       />
    //     </div>

    //     <div className="flex flex-col gap-2">
    //       <Label htmlFor="stock">Stock</Label>
    //       <Input
    //         id="stock"
    //         {...register("stock", {
    //           required: { value: true, message: "Stock is required" },
    //           pattern: {
    //             value: /^[0-9]+$/,
    //             message: "Stock must be a number",
    //           },
    //         })}
    //         type="number"
    //         placeholder="Enter stock quantity"
    //       />
    //     </div>

    //     {/* <div className="flex flex-col gap-2">
    //       <UploadImageForm
    //         onImageUploaded={(url) => {
    //           setImageUrl(url);
    //         }}
    //       />
    //     </div> */}
    //     <div className="flex flex-col gap-2">
    //       <Label htmlFor="image">Image URL</Label>
    //       <Input
    //         id="image"
    //         {...register("image", {
    //           required: { value: true, message: "Image URL is required" },
    //           // pattern: {
    //           //   value: /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/,
    //           //   message: "Please enter a valid image URL",
    //           // },
    //         })}
    //         type="file"
    //       />
    //     </div>

    //     <div className="flex flex-col gap-2">
    //       <Label htmlFor="category">Category</Label>
    //       <Controller
    //         name="category"
    //         control={control}
    //         render={({ field }) => (
    //           <Combobox
    //             data={categories.map((category) => ({
    //               value: `${category.id}`,
    //               label: `${category.name}`,
    //             }))}
    //             value={`${field.value}`}
    //             onChange={(selectedValued) =>
    //               field.onChange(Number(selectedValued))
    //             }
    //             placeholder="Select Category"
    //           ></Combobox>
    //         )}
    //       />
    //     </div>

    //     <div className="flex flex-col gap-2">
    //       <Label htmlFor="status">Status</Label>
    //       <Controller
    //         name="status"
    //         control={control}
    //         render={({ field }) => (
    //           <Select onValueChange={field.onChange} defaultValue={field.value}>
    //             <SelectTrigger className="w-full">
    //               <SelectValue placeholder="Select status" />
    //             </SelectTrigger>
    //             <SelectContent>
    //               <SelectItem value="publish">Publish</SelectItem>
    //               <SelectItem value="draft">Not Publish</SelectItem>
    //             </SelectContent>
    //           </Select>
    //         )}
    //       />
    //     </div>

    //     <SheetFooter>
    //       <div className="flex gap-2">
    //         <Button type="submit" className="grow">
    //           Add
    //         </Button>
    //       </div>
    //       <SheetClose asChild>
    //         <Button variant="outline">Close</Button>
    //       </SheetClose>
    //     </SheetFooter>
    //   </div>
    // </form>
  );
}
