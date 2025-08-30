"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Category, Product } from "@/lib/type";
import EditFormProduct from "../Form/EditFormProduct";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatNumber, formatRupiah } from "@/lib/convert";
import { useAuthToken } from "@/lib/authHook";
import ConfirmationDialog from "./ConfirmationDialog";
import { FilePen, Trash2Icon } from "lucide-react";
import { Button } from "../ui/button";
import { isDemoMode } from "@/lib/utils";

export default function TableDataProducts({
  dataProducts,
  categories,
  page,
}: {
  page: number;
  dataProducts: Product[];
  categories: Category[];
}) {
  const router = useRouter();
  const { token } = useAuthToken();

  function handleDelete(id: string) {
    // cek mode
    if (isDemoMode()) return toast.error("DEMO MODE: CAN'T CHANGE");

    toast.promise(
      fetch(`/api/products/${id}`, {
        method: "DELETE",
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
        success: () => "Data product succesfully deleted.",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error: (err: any) => err.message || "Fail delete data",
      }
    );
    router.refresh();
  }

  return (
    <div className="">
      <h3 className="mb-4">Data All Products</h3>
      <Table className="border w-full">
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataProducts?.map((item: Product, index: number) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                {index + (1 + (page - 1) * 20)}
              </TableCell>
              <TableCell>
                <div className="truncate w-20 md:w-40">{item.name}</div>
              </TableCell>
              <TableCell>
                <div className="truncate w-20 md:w-40">
                  {categories.map((category) =>
                    category.id == item.categoryId ? `${category.name}` : null
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="truncate w-20">{item.description}</div>
              </TableCell>
              <TableCell>
                <div className="w-20">{formatRupiah(item.price)}</div>
              </TableCell>
              <TableCell>{formatNumber(String(item.stock))}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell className="flex gap-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button>
                      <FilePen />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="overflow-y-auto max-h-screen">
                    <SheetHeader>
                      <SheetTitle>Edit Product</SheetTitle>
                      <SheetDescription>Edit a product</SheetDescription>
                    </SheetHeader>
                    <EditFormProduct product={item} categories={categories} />
                  </SheetContent>
                </Sheet>
                <ConfirmationDialog
                  title="Delete"
                  variant="destructive"
                  description="Delete a product"
                  onConfirm={() => handleDelete(item.id)}
                >
                  <Trash2Icon></Trash2Icon>
                </ConfirmationDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
