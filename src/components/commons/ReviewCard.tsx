"use client";

import React, { ChangeEvent, MouseEvent, useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { Maximize2, PlusCircle, Star, Trash2 } from "lucide-react";
import { JWTPayload, User } from "@/lib/type";
import { formatWaktu } from "@/lib/convert";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { frontendUpdateReviewSchema } from "@/lib/zodSchema";
import { useRouter } from "next/navigation";
import { useAuthToken } from "@/lib/authHook";
import z from "zod";
import { toast } from "sonner";
import Image from "next/image";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

interface review {
  id: string;
  userId: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: Pick<User, "username">;
  ImageReview: Image[];
}

type Image = {
  // publicId: null | string;
  id: number;
  url: string;
};

type x = {
  id: number;
  image: File;
};

export type UpdateReviewFormValues = z.infer<typeof frontendUpdateReviewSchema>;

export default function ReviewCard({
  review,
  session,
  productId,
}: {
  session?: JWTPayload | null;
  review: review;
  productId: string;
}) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const form = useForm<UpdateReviewFormValues>({
    resolver: zodResolver(frontendUpdateReviewSchema),
    defaultValues: {
      rating: review.rating,
      comment: review.comment || "",
    },
  });
  const router = useRouter();
  const { token } = useAuthToken();
  const [previews, setPreviews] = useState<Image[]>([]);
  // const [newImages, setNewImages] = useState<File[]>([]);
  const [newImages, setNewImages] = useState<x[]>([]);

  // pake check manual karena ga bisa di taro di rhf
  const [errorImages, setErrorImages] = useState("");
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  const onSubmit = async (data: UpdateReviewFormValues) => {
    // TODO bikin validation image
    console.log(previews.length);
    if (previews.length > 3)
      return setErrorImages("Gambar tidak boleh lebih dari 3");
    console.log(newImages, "new image");
    console.log(deletedImages, "deleted image");
    const newImageArray = newImages.map((img) => img.image);
    const files = (newImageArray as unknown as FileList) || null;
    const fileArray = Array.from(files);
    let uploadedImageUrl: string[] | null = null;

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

    toast.promise(
      // ?? apa ini bagus??
      fetch(`/api/products/${productId}/reviews`, {
        method: "PUT",
        body: JSON.stringify({
          id: review.id,
          comment: data.comment,
          rating: data.rating,
          newImages: uploadedImageUrl,
          deletedImages: deletedImages,
        }),
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
          setIsEditing(false);
          setDeletedImages([]);
          setNewImages([]);
          setErrorImages("");
          router.refresh();
          return "Comment succesfuly changes.";
        },
        error: () => "Fail changes comment",
      }
    );
  };

  // const onDeleteHandler = async (data: UpdateReviewFormValues) => {
  //   console.log(productId, String(data.rating), data.comment);
  //   console.log(data, "ini");
  //   toast.promise(
  //     fetch(`/api/products/${productId}/reviews`, {
  //       method: "PUT",
  //       body: JSON.stringify({
  //         id: review.id,
  //         comment: data.comment,
  //         rating: data.rating,
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
  //       success: () => {
  //         return "Comment succesfuly changes.";
  //       },
  //       error: () => "Fail changes comment",
  //     }
  //   );
  //   setIsEditing(false);
  //   router.refresh();
  // };

  const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
  // Tambahkan 30 hari ke tanggal awal
  const thirtyDaysLater = new Date(review.createdAt.getTime() + thirtyDaysInMs);

  const now = new Date(); // Tanggal dan waktu saat ini

  // Periksa apakah tanggal sekarang sudah lebih dari 30 hari sejak tanggal awal
  const isMoreThanThirtyDays = now > thirtyDaysLater;

  useEffect(() => {
    // Hanya dijalankan sekali saat komponen pertama kali di-render
    setPreviews(review.ImageReview.map((img) => img));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const newPreviews: Image[] = [];

    if (!files) return;

    // Jika tidak ada file yang dipilih, set previews ke array kosong
    if (files.length === 0) {
      // setPreviews([]);
      return;
    }

    // Iterasi setiap file yang dipilih
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      // Ambil timestamp dalam milidetik
      const timestamp = Date.now();

      // Buat angka acak dari 0 hingga 999
      const randomNumber = Math.floor(Math.random() * 1000);
      const uniqueNumber = `${timestamp}${String(randomNumber).padStart(
        3,
        "0"
      )}`;

      reader.onloadend = () => {
        // Saat pembacaan selesai, tambahkan Data URL ke array previews
        newPreviews.push({
          id: Number(uniqueNumber),
          url: reader.result as string,
        });
        if (newPreviews.length === files.length) {
          // Setelah semua file diproses, perbarui state
          setPreviews((prev) => [...prev, ...newPreviews]);
          console.log(previews);
        }
      };

      // ! gmn caranya biar bisa apus dari state File IMAGE

      // taro di state new Image
      setNewImages((prev) => [
        ...prev,
        { id: Number(uniqueNumber), image: file },
      ]);

      // Baca file sebagai Data URL
      reader.readAsDataURL(file);
    }
  };

  // !!
  const initImage = review.ImageReview.map((img) => img);

  const handleDeleteImage = ({
    e,
    id,
  }: {
    e: MouseEvent<SVGSVGElement>;
    id: number;
  }) => {
    e.preventDefault();
    // toast.promise(
    //   fetch(`/api/products/images/upload`, {
    //     method: "DELETE",
    //     body: JSON.stringify({
    //       imageUrl: url,
    //     }),
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
    //     loading: "Deleting image...",
    //     success: () => {
    //       const updatedPreviews = previews.filter((image) => image !== url);
    //       setPreviews(updatedPreviews);
    //       router.refresh();
    //       return "Image successfully deleted.";
    //     },
    //     error: (err) => `Failed to delete image: ${err.message}`,
    //   }
    // );

    const updatedPreviews = previews.filter((image) => image.id !== id);
    setPreviews(updatedPreviews);
    const updatedNewImages = newImages.filter((file) => file.id !== id);
    setNewImages(updatedNewImages);

    if (initImage.some((img) => img.id == id)) {
      const urll = previews.find((image) => image.id == id);
      if (urll) {
        setDeletedImages((prev) => [...prev, urll?.url]);
      }
    }

    // // Buat salinan (copy) array untuk menghindari mutasi langsung
    // const updatedPreviews = [...previews];

    // // Cari indeks dari gambar pertama yang cocok dengan URL yang diberikan
    // const index = updatedPreviews.findIndex((image) => image === url);

    // // Jika indeks ditemukan (tidak sama dengan -1)
    // if (index !== -1) {
    //   // Hapus satu elemen (1) dari array pada indeks tersebut
    //   updatedPreviews.splice(index, 1);

    //   // Perbarui state dengan array yang sudah dimodifikasi
    //   setPreviews(updatedPreviews);
    // }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center">
          <span className="p-2 text-lg">{review.user.username}</span>
          <Badge variant="default" className="flex items-center">
            <Star className="mr-1 h-4 w-4 fill-current text-yellow-500" />
            {review.rating}
          </Badge>
        </CardTitle>
        <CardDescription className="text-sm">
          {`
          ${
            review.createdAt.toISOString() != review.updatedAt.toISOString()
              ? "Di edit"
              : "Di ulas"
          } pada: ${formatWaktu(review.updatedAt)}`}
          {review.userId == session?.id &&
          !isMoreThanThirtyDays &&
          !isEditing ? (
            <Button
              variant={"link"}
              onClick={() => setIsEditing(true)}
              className="p-0 mx-4"
            >
              Edit
            </Button>
          ) : null}
        </CardDescription>
      </CardHeader>
      {isEditing ? (
        // Tampilkan formulir edit
        <div className="p-4 relative">
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
                              i < (field.value || 0)
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

              {/* <FormField control={form.control} name="image"
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
            /> */}
              <Label htmlFor="image">
                <PlusCircle></PlusCircle>
                Add Image
              </Label>
              <Input
                type="file"
                className="hidden"
                name="image"
                id="image"
                onChange={handleFileChange}
                multiple
              ></Input>
              {errorImages && <p className="text-red-500">{errorImages}</p>}
              {/* Tampilkan pratinjau gambar */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginTop: "20px",
                }}
              >
                {previews.length > 0 &&
                  previews.map((image, index) => (
                    <div key={index} className="relative group">
                      <Image
                        unoptimized
                        src={image.url}
                        width={100}
                        height={100}
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                        className="group-hover:opacity-50"
                      />
                      <Maximize2 className="absolute left-1/2 top-1/2 -translate-1/2 group-hover:block hidden cursor-pointer"></Maximize2>
                      <Trash2
                        className="absolute right-0 top-0 cursor-pointer group-hover:block hidden"
                        onClick={(e) => handleDeleteImage({ e, id: image.id })}
                      ></Trash2>
                    </div>
                  ))}

                {/* {previews.length > 0 &&
                  previews.map((previewUrl, index) => (
                    <div key={index} className="relative group">
                      <Image
                        unoptimized
                        src={previewUrl}
                        width={100}
                        height={100}
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                        className="group-hover:opacity-50"
                      />
                      <Maximize2 className="absolute left-1/2 top-1/2 -translate-1/2 group-hover:block hidden cursor-pointer"></Maximize2>
                      <Trash2
                        className="absolute right-0 top-0 cursor-pointer group-hover:block hidden"
                        onClick={(e) =>
                          handleDeleteImage({ e, url: previewUrl })
                        }
                      ></Trash2>
                    </div>
                  ))} */}
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Mengirim..." : "Edit Ulasan"}
                </Button>
                <Button
                  type="button"
                  variant={"destructive"}
                  onClick={() => {
                    setIsEditing(false);
                    router.refresh();
                  }}
                >
                  Batal
                </Button>
              </div>
            </form>
          </Form>
        </div>
      ) : (
        // Tampilkan konten ulasan biasa
        <CardContent>
          <p>{review.comment}</p>
          {/* Tampilkan pratinjau gambar */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            {previews.length > 0 &&
              previews.map((image, index) => (
                <Image
                  key={index}
                  unoptimized
                  src={image.url}
                  width={100}
                  height={100}
                  alt={`Preview ${index + 1}`}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
