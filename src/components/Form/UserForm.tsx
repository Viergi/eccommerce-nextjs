"use client";

import React, { useState } from "react";
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User } from "@/lib/type";
import { useAuthToken } from "@/lib/authHook";
import z from "zod";
import { editUserSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircleIcon, X } from "lucide-react";
import ConfirmationDialog from "../commons/ConfirmationDialog";

export type FormEditUserValues = z.infer<typeof editUserSchema>;

export default function UserForm({ user }: { user: User }) {
  const form = useForm<FormEditUserValues>({
    mode: "onChange",
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      username: user.username,
      email: user.email,
      nomorTelepon: user.nomorTelepon,
      address: user.address,
    },
  });
  const [edit, setEdit] = useState<boolean>(false);
  const router = useRouter();
  const { token } = useAuthToken();

  // const onSubmit = async (data: FormEditUserValues) => {
  //   toast.promise(updateUserAction({ data, userId: user.id }), {
  //     loading: "Saving changes...",
  //     success: (res) => {
  //       setEdit(false);
  //       router.refresh();
  //       return "Data successfully changes.";
  //     },
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     error: (err: any) => {
  //       form.reset();
  //       return err.message || "Fail changes data";
  //     },
  //   });

  //   setEdit(false);
  // };

  const onSubmit = async (data: FormEditUserValues) => {
    toast.promise(
      fetch(`/api/user/${user.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).then(async (res) => {
        const result = await res.json();
        if (!res.ok) {
          console.log(result.errors);
          throw new Error(result.errors || "Something went wrong");
        }
        return result;
      }),
      {
        loading: "Saving changes...",
        success: () => {
          setEdit(false);
          router.refresh();
          return "Data successfully changes.";
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error: (err: any) => {
          form.reset();
          return err.message || "Fail changes data";
        },
      }
    );

    setEdit(false);
    router.refresh();
  };

  const handleConfirmSubmit = () => {
    // Panggil fungsi submit dari RHF secara manual
    form.handleSubmit(onSubmit)();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid flex-col gap-4 px-4"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  disabled={!edit}
                  className="disabled:bg-black/20"
                  placeholder="Enter username"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  className="disabled:bg-black/20"
                  disabled={!edit}
                  type="email"
                  placeholder="Enter email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field: { value, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  value={value || ""}
                  className="disabled:bg-black/20"
                  disabled={!edit}
                  type="text"
                  placeholder="Enter address"
                  {...fieldProps}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nomorTelepon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Telepon</FormLabel>
              <FormControl>
                <Input
                  disabled={!edit}
                  type="number"
                  placeholder="Enter telephone number"
                  className="disabled:bg-black/20 [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          {edit && (
            <div className="flex gap-2">
              <ConfirmationDialog
                title={"Changes"}
                description={"Changes data user"}
                onConfirm={handleConfirmSubmit}
              >
                <CheckCircleIcon />
              </ConfirmationDialog>

              <Button
                type="button"
                variant={"destructive"}
                onClick={() => {
                  setEdit(false);
                  form.reset();
                }}
              >
                <X></X>
              </Button>
            </div>
          )}
          {!edit && (
            <Button onClick={() => setEdit(true)} type="button">
              Edit
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
