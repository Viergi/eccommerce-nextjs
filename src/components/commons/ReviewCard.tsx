"use client";

import React, { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { Star } from "lucide-react";
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
import { updateReviewSchema } from "@/lib/zodSchema";
import { useRouter } from "next/navigation";
import { useAuthToken } from "@/lib/authHook";
import z from "zod";
import { toast } from "sonner";

interface review {
  id: string;
  userId: string;
  rating: number;
  imageUrl: string | null;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: Pick<User, "username">;
}

export type UpdateReviewFormValues = z.infer<typeof updateReviewSchema>;

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
    resolver: zodResolver(updateReviewSchema),
    defaultValues: {
      rating: review.rating,
      comment: review.comment || "",
    },
  });
  const router = useRouter();
  const { token } = useAuthToken();

  const onSubmit = async (data: UpdateReviewFormValues) => {
    toast.promise(
      fetch(`/api/products/${productId}/reviews`, {
        method: "PUT",
        body: JSON.stringify({
          id: review.id,
          comment: data.comment,
          rating: data.rating,
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
          {review.userId == session?.id && !isMoreThanThirtyDays ? (
            <Button
              variant={"link"}
              onClick={() => setIsEditing(true)}
              className="p-0 mx-4"
            >
              Edit
            </Button>
          ) : (
            ""
          )}
        </CardDescription>
      </CardHeader>
      {isEditing ? (
        // Tampilkan formulir edit
        <div className="p-4">
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
                      <textarea
                        placeholder="Tulis ulasan Anda di sini..."
                        className="resize-none px-2 py-1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Mengirim..." : "Edit Ulasan"}
              </Button>
            </form>
          </Form>
          {/* Formulir untuk mengedit rating dan comment */}
          {/* Tombol Simpan dan Batal */}
        </div>
      ) : (
        // Tampilkan konten ulasan biasa
        <CardContent>
          <p>{review.comment}</p>
        </CardContent>
      )}
    </Card>
  );
}
