"use client";
import React from "react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import CategoryForm from "../Form/CategoryForm";

export default function AddCategoryButton() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button> Add Category+ </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto max-h-screen">
        <SheetHeader>
          <SheetTitle>Add Product</SheetTitle>
          <SheetDescription>Add a product</SheetDescription>
        </SheetHeader>
        <CategoryForm />
      </SheetContent>
    </Sheet>
  );
}
