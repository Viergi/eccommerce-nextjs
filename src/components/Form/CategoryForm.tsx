"use client";

import React from "react";
import { SheetClose, SheetFooter } from "../ui/sheet";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthToken } from "@/lib/authHook";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema } from "@/lib/zodSchema";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "../ui/textarea";
import { isDemoMode } from "@/lib/utils";

type FormCategoriesValues = z.infer<typeof categorySchema>;

export default function CategoryForm() {
  const form = useForm<FormCategoriesValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const router = useRouter();
  const { token } = useAuthToken();

  const onSubmit = async (data: FormCategoriesValues) => {
    // cek mode
    if (isDemoMode()) return toast.error("DEMO MODE: CAN'T CHANGE");

    toast.promise(
      fetch(`/api/categories`, {
        method: "POST",
        body: JSON.stringify({
          name: data.name,
          description: data.description || null,
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
        success: () => "Data Category succesfully add.",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error: (err: any) => err.message || "Fail adding data",
      }
    );
    router.refresh();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid flex-col gap-4 px-4"
      >
        {/* Input untuk Category Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter category name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Input untuk Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter category description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Footer untuk Tombol */}
        <SheetFooter>
          <div className="flex gap-2">
            <SheetClose asChild>
              <Button type="submit" className="grow">
                Add
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </form>
    </Form>
  );
}
