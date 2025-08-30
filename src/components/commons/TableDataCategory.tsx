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
import { Category } from "@/lib/type";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import EditFormCategory from "../Form/EditFormCategory";
import { useAuthToken } from "@/lib/authHook";
import ConfirmationDialog from "./ConfirmationDialog";
import { FilePen, Trash2Icon } from "lucide-react";
import { Button } from "../ui/button";
import { isDemoMode } from "@/lib/utils";

export default function TableDataCategory({
  dataCategories,
}: {
  dataCategories: Category[];
}) {
  const router = useRouter();
  const { token } = useAuthToken();

  const handleDelete = (id: number) => {
    // cek mode
    if (isDemoMode()) return toast.error("DEMO MODE: CAN'T CHANGE");

    toast.promise(
      fetch(`/api/categories/${id}`, {
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
        success: () => "Data category succesfully deleted.",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error: (err: any) => err.message || "Fail delete data",
      }
    );
    router.refresh();
  };

  // const onDeleteHandle = async () => {
  //   toast.promise(
  //     fetch(`/api/products/${product.id}`, {
  //       method: "DELETE",
  //     }).then(async (res) => {
  //       const result = await res.json();
  //       if (!res.ok) {
  //         throw new Error(result.error || "Something Went Wrong");
  //       }
  //       return result;
  //     }),
  //     {
  //       loading: "Saving changes...",
  //       success: () => "Data admin succesfuly change.",
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //       error: (err: any) => err.message || "Fail changes data",
  //     }
  //   );
  //   router.refresh();
  // };
  console.log(dataCategories);

  return (
    <div className="">
      <h3 className="mb-4">Data All Category</h3>
      <Table className="border w-full">
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataCategories?.map((item: Category, index: number) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>
                <div className="truncate w-20 md:w-40">{item.name}</div>
              </TableCell>
              <TableCell>
                <div className="truncate w-20 md:w-40">
                  {item.description?.trim() == "" ? "--" : item.description}
                </div>
              </TableCell>
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
                    <EditFormCategory category={item} />
                  </SheetContent>
                </Sheet>
                <ConfirmationDialog
                  variant="destructive"
                  title="Delete"
                  description="Delete a category"
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
