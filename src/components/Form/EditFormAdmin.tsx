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
import { toast } from "sonner";
import { useAuthToken } from "@/lib/authHook";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Trash2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { editAdminSchema } from "@/lib/zodSchema";
import z from "zod";

// export type FormChangeValues = {
//   email: string;
//   fullname: string;
//   level: string;
//   nomorTelepon: string;
// };

export type FormEditAdminValues = z.infer<typeof editAdminSchema>;

export default function EditFormAdmin({
  fullname,
  level,
  id,
  nomorTelepon,
  email,
}: {
  fullname: string;
  level: string;
  id: number;
  nomorTelepon: string;
  email: string;
}) {
  const form = useForm<FormEditAdminValues>({
    resolver: zodResolver(editAdminSchema),
    defaultValues: {
      fullname,
      level,
      email,
      nomorTelepon,
    },
  });
  const router = useRouter();
  const { token } = useAuthToken();

  const onSubmit = async (data: FormEditAdminValues) => {
    // console.log(name, level, id, nomorTelepon, email);
    console.log(data, "ini");
    console.log(id);
    toast.promise(
      fetch(`/api/admin/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          fullname: data?.fullname,
          level: data?.level,
          email: data?.email,
          nomorTelepon: data?.nomorTelepon,
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

  const onDeleteHandle = async (id: number) => {
    console.log(id);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid flex-col gap-4 px-4"
      >
        {/* Input untuk Fullname */}
        <FormField
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Input untuk Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Masukan email anda"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Input untuk Nomor Telepon */}
        <FormField
          control={form.control}
          name="nomorTelepon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Telepon</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Masukan nomor telepon anda"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Select untuk Level */}
        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Level Admin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="SuperAdmin">Super Admin</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="None">Belum di Verifikasi</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Footer untuk Tombol */}
        <SheetFooter>
          <div className="flex gap-2">
            <SheetClose asChild>
              <Button type="submit" className="grow">
                Save changes
              </Button>
            </SheetClose>
            {/* Tombol Delete menggunakan SVG inline */}
            <SheetClose asChild>
              <Button variant="destructive" onClick={() => onDeleteHandle(id)}>
                <Trash2 />
              </Button>
            </SheetClose>
          </div>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </form>
    </Form>
  );
}
