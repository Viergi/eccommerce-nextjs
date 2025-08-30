/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaPenSquare } from "react-icons/fa";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Admin } from "@/lib/type";
import EditFormAdmin from "../Form/EditFormAdmin";

export default function TableDataAdmin({
  dataAllAdmin,
  role,
}: {
  role?: string;
  dataAllAdmin: Admin[] | null;
}) {
  return (
    <div className="">
      <h3 className="">All Admin Data</h3>
      <Table className="border w-full">
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Nomor Telepon</TableHead>
            <TableHead>Level Admin</TableHead>
            {role == "SuperAdmin" && <TableHead>Edit</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataAllAdmin?.map((item: any, index: number) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{item.fullname}</TableCell>
              <TableCell>{item.username}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.nomorTelepon}</TableCell>
              <TableCell>
                {item.level == "SuperAdmin"
                  ? "Super Admin"
                  : item.level == "Admin"
                  ? "Admin"
                  : "Belum di acc"}
              </TableCell>
              {role == "SuperAdmin" && (
                <TableCell>
                  <Sheet>
                    <SheetTrigger asChild>
                      <FaPenSquare className="text-2xl cursor-pointer" />
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Edit Admin</SheetTitle>
                        <SheetDescription>
                          Edit, Verifikasi, Hapus Admin
                        </SheetDescription>
                      </SheetHeader>
                      <EditFormAdmin fullname={item.fullname} {...item} />
                    </SheetContent>
                  </Sheet>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
