"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import ProductForm from "../Form/ProductForm";
import { Category } from "@/lib/type";

export default function AddProductButton({
  categories,
}: {
  categories: Category[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open}>
      <SheetTrigger asChild>
        <Button onClick={() => setOpen(true)}> Add Product+ </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto max-h-screen">
        <SheetHeader>
          <SheetTitle>Add Product</SheetTitle>
          <SheetDescription>Add a product</SheetDescription>
        </SheetHeader>
        <ProductForm categories={categories} setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  );
}
