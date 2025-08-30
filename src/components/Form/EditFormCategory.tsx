"use client";

import React from "react";
import { SheetClose, SheetFooter } from "../ui/sheet";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Category, FormCategories } from "@/lib/type";
import { toast } from "sonner";
import { useAuthToken } from "@/lib/authHook";

export default function EditFormCategory({ category }: { category: Category }) {
  const { register, handleSubmit } = useForm<FormCategories>({
    defaultValues: {
      name: category.name,
      description: category.description,
    },
  });
  const router = useRouter();
  const { token } = useAuthToken();

  const onSubmit = async (data: FormCategories) => {
    // console.log(name, level, id, nomorTelepon, email);
    console.log(data, "ini");
    toast.promise(
      fetch(`/api/categories/${category.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: data.name,
          description: data.description,
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
        success: () => "Data admin succesfuly change.",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error: (err: any) => err.message || "Fail changes data",
      }
    );
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid flex-col gap-4 px-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Category Name</Label>
          <Input
            id="name"
            {...register("name", {
              required: { value: true, message: "Category name is required" },
            })}
            type="text"
            placeholder="Enter Category name"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            {...register("description")}
            className="w-full resize-none p-2"
            rows={4}
            placeholder="Enter Category description"
          />
        </div>

        <SheetFooter>
          <div className="flex gap-2">
            <SheetClose asChild>
              <Button type="submit" className="grow">
                Change
              </Button>
            </SheetClose>
          </div>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </div>
    </form>
  );
}
