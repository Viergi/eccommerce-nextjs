"use client";

import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useForm } from "react-hook-form";
import z from "zod";
import { updateOrderStatusSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { updateOrderAction } from "@/app/actions/order/crud-order";
import { isDemoMode } from "@/lib/utils";

export type OrderStatusValues = z.infer<typeof updateOrderStatusSchema>;

export default function UpdateStatusModal({
  status,
  id,
}: {
  id: string;
  status: OrderStatusValues["status"];
}) {
  const form = useForm<OrderStatusValues>({
    resolver: zodResolver(updateOrderStatusSchema),
    defaultValues: { status },
  });

  const onSubmit = async (data: OrderStatusValues) => {
    if (isDemoMode()) return toast.error("DEMO MODE: CAN'T CHANGES");

    toast.promise(
      updateOrderAction({ data, id }).then(async (res) => {
        return res;
      }),
      {
        loading: "Loading...",
        success: (res) => {
          if (!res.success) throw res;
          return "Successflly change status";
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
        error: (err: any) => "Failed change status ",
      }
    );
  };
  // const onSubmit = async (data: OrderStatusValues) => {
  //   toast.promise(
  //     fetch(`/api/orders/${id}`, {
  //       method: "PUT",
  //       body: JSON.stringify(data),
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
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
  //       success: () => "Order status successfully changes.",
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //       error: (err: any) => err.message || "Fail changes status",
  //     }
  //   );

  //   // Setelah kedua proses (unggah dan simpan) selesai
  //   router.refresh();
  //   console.log(data, new Date());
  // };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Ubah status order</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Status</DialogTitle>
          <DialogDescription>
            Make change status order here. Click save when you&apos;re done
            here.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">PENDING</SelectItem>
                        <SelectItem value="PAID">PAID</SelectItem>
                        <SelectItem value="DELIVERED">DELIVERED</SelectItem>
                        <SelectItem value="SHIPPED">SHIPPED</SelectItem>
                        <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="submit">Save changes</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
