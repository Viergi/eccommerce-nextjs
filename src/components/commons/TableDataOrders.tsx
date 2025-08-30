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
import { FullOrderDetails } from "@/lib/type";
import { formatRupiah, formatWaktu } from "@/lib/convert";
import Link from "next/link";
import { Button } from "../ui/button";

const PAGE_SIZE = 20;

export default function TableDataOrders({
  dataOrders,
  page,
}: {
  page: number;
  dataOrders: FullOrderDetails[];
}) {
  return (
    <div className="">
      <h3 className="mb-4">Data All Products</h3>
      <Table className="border w-full">
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Id</TableHead>
            <TableHead>Tanggal Pesanan</TableHead>
            <TableHead>Nama Pelanggan</TableHead>
            <TableHead>Total Belanja</TableHead>
            <TableHead>Status Pesanan</TableHead>
            <TableHead>Metode Pembayaran</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataOrders?.map((item: FullOrderDetails, index: number) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                {index + 1 + (page - 1) * PAGE_SIZE}
              </TableCell>
              <TableCell>
                <div className="truncate w-20">{item.id}</div>
              </TableCell>
              <TableCell>{formatWaktu(item.orderDate)}</TableCell>
              <TableCell>
                <div className="truncate w-20">
                  {item.user.username.toLowerCase()}
                </div>
              </TableCell>
              <TableCell>
                <div className="w-20">{formatRupiah(item.totalAmount)}</div>
              </TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>{item.paymentMethod ?? "Belum bayar"}</TableCell>
              <TableCell className="flex gap-2">
                <Link href={`/admin/orders/${item.id}`}>
                  <Button variant={"link"}>Lihat Detail</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
