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
import { Star } from "lucide-react";
import { reviewSchema } from "@/lib/zodSchema";
import { useRouter } from "next/navigation";
import { useAuthToken } from "@/lib/authHook";
import { toast } from "sonner";

export type ReviewFormValues = z.infer<typeof reviewSchema>;

export default function ReviewForm({ productId }: { productId: string }) {
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });
  const router = useRouter();
  const { token } = useAuthToken();

  const onSubmit = async (data: ReviewFormValues) => {
    console.log(productId, String(data.rating), data.comment);
    console.log(data, "ini");
    toast.promise(
      fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        body: JSON.stringify({
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
          return "Comment succesfuly add.";
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error: (err: any) => err.message || "Fail adding data",
      }
    );
    router.refresh();
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
              {form.formState.isSubmitting ? "Mengirim..." : "Kirim Ulasan"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
