"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PlusCircle, Star } from "lucide-react";
import { frontEndReviewSchema } from "@/lib/zodSchema";
import { useRouter } from "next/navigation";
import { useAuthToken } from "@/lib/authHook";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import { ChangeEvent, useState } from "react";

export type ReviewFormValues = z.infer<typeof frontEndReviewSchema>;

export default function ReviewForm({ productId }: { productId: string }) {
  const form = useForm<ReviewFormValues>({
    // mode: "onChange",
    resolver: zodResolver(frontEndReviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });
  const router = useRouter();
  const { token } = useAuthToken();

  const onSubmit = async ({ rating, comment, image }: ReviewFormValues) => {
    // console.log(productId, String(rating), comment);
    console.log({ rating, comment, image }, "ini");

    const files = (image as unknown as FileList) || null;
    const fileArray = Array.from(files);
    let uploadedImageUrl: string[] | null = null;
    console.log(fileArray);
    if (files) {
      const formData = new FormData();
      fileArray.forEach((file) => {
        formData.append("image", file);
      });

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
        uploadedImageUrl = uploadResult.imageUrl.map(
          (item: { url: string }) => item.url
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        toast.error(`Gagal upload gambar`, err);
        return;
      }
    }

    const reviewData = {
      comment,
      rating,
      image: uploadedImageUrl, // Gunakan URL gambar yang sudah diunggah
    };

    toast.promise(
      fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        body: JSON.stringify(reviewData),
        headers: {
          Authorization: `Bearer ${token}`,
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
          return "Comment succesfuly add.";
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error: (err: any) => err.message || "Fail adding data",
      }
    );
    router.refresh();
  };

  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const newPreviews: string[] = [];

    if (!files) return;

    // Jika tidak ada file yang dipilih, set previews ke array kosong
    if (files.length === 0) {
      setPreviews([]);
      return;
    }

    // Iterasi setiap file yang dipilih
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onloadend = () => {
        // Saat pembacaan selesai, tambahkan Data URL ke array previews
        newPreviews.push(reader.result as string);
        if (newPreviews.length === files.length) {
          // Setelah semua file diproses, perbarui state
          setPreviews(newPreviews);
        }
      };

      // Baca file sebagai Data URL
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="my-4">
      <CardHeader>
        <CardTitle>Berikan Ulasan Anda</CardTitle>
        <CardDescription>
          Bagikan pengalaman Anda tentang produk ini.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-6 w-6 cursor-pointer transition-colors ${
                            i < field.value
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                          onClick={() => field.onChange(i + 1)}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bagian Ulasan */}
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ulasan</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tulis ulasan Anda di sini..."
                      className="resize-none px-2 py-1"
                      {...field}
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
                  <FormLabel className="w-fit p-2 cursor-pointer">
                    <span>Add Image</span>
                    <PlusCircle></PlusCircle>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      accept="image/**"
                      onChange={(event) => {
                        handleFileChange(event);
                        onChange(event.target.files);
                      }}
                      placeholder="Tulis ulasan Anda di sini..."
                      className="hidden"
                      {...fieldProps}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tampilkan pratinjau gambar */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              {previews.length > 0 ? (
                previews.map((previewUrl, index) => (
                  <Image
                    unoptimized
                    key={index}
                    src={previewUrl}
                    width={100}
                    height={100}
                    alt={`Preview ${index + 1}`}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                ))
              ) : (
                <p>Pilih gambar untuk melihat pratinjau.</p>
              )}
            </div>
            {/* <ImagePreviewer></ImagePreviewer> */}
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Mengirim..." : "Kirim Ulasan"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
