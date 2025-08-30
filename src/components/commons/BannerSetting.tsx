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
import EditBannerForm from "../Form/EditBannerForm";
import { toast } from "sonner";
import { useAuthToken } from "@/lib/authHook";
import { useRouter } from "next/navigation";
import { Banner } from "./BannerImage";
import { Button } from "../ui/button";
import { FilePen, Trash2Icon } from "lucide-react";
import ConfirmationDialog from "./ConfirmationDialog";
import { isDemoMode } from "@/lib/utils";

export default function BannerSetting({
  dataBanners,
}: {
  dataBanners: Banner[];
}) {
  const { token } = useAuthToken();
  const router = useRouter();

  const handleDelete = (id: string) => {
    // cek mode
    if (isDemoMode()) return toast.error("DEMO MODE: CAN'T CHANGE");

    toast.promise(
      fetch(`/api/banner/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
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
        success: () => "Banner deleted successfully.",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error: (err: any) => err.message || "Fail deleted banner",
      }
    );

    // Setelah kedua proses (unggah dan simpan) selesai
    router.refresh();
  };

  if (dataBanners.length == 0)
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={4} className="text-center text-xl">
              <p>There is no banner yet.</p>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

  return (
    <Table className="border w-full">
      <TableHeader>
        <TableRow>
          <TableHead>No.</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Edit</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dataBanners?.map((item: Banner, index: number) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>
              <div className="truncate w-20 md:w-40">{item.title}</div>
            </TableCell>
            <TableCell>
              <div
                className={`truncate w-20 md:w-40 ${
                  item.status ? "text-green-500" : "text-red-500"
                }`}
              >
                {item.status ? "Active" : "Not Active"}
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
                    <SheetTitle>Edit banner</SheetTitle>
                    <SheetDescription>{`Edit a banner ${item.title}`}</SheetDescription>
                  </SheetHeader>
                  <EditBannerForm banner={item} />
                </SheetContent>
              </Sheet>
              <ConfirmationDialog
                variant="destructive"
                title="Delete"
                description="Delete a banner"
                onConfirm={() => handleDelete(item.id)}
              >
                <Trash2Icon></Trash2Icon>
              </ConfirmationDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
