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
import { User } from "@/lib/type";
import { formatWaktu } from "@/lib/convert";
import Link from "next/link";
import { Button } from "../ui/button";

export default function TableDataUser({
  dataUsers,
  page,
}: {
  page: number;
  dataUsers: User[];
}) {
  return (
    <div className="">
      <h3 className="mb-4">Data All Users</h3>
      <Table className="border w-full">
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Tanggal Bergabung</TableHead>
            <TableHead>Jumlah Pesanan</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataUsers?.map((item: User, index: number) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                {index + (1 + (page - 1) * 20)}
              </TableCell>
              <TableCell>
                <div className="truncate w-40">{item.username}</div>
              </TableCell>
              <TableCell>
                <div className="truncate w-45">{item.email}</div>
              </TableCell>
              <TableCell>{formatWaktu(item.createdAt)}</TableCell>
              <TableCell>{item.orderCount}</TableCell>
              <TableCell className="flex gap-2">
                <Button variant={"link"}>
                  <Link href={`/admin/manage-user/${item.id}`}>
                    Lihat Detail
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
