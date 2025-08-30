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
import BannerForm from "../Form/BannerForm";

export default function AddBannerButton() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button> Add Banner + </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto max-h-screen">
        <SheetHeader>
          <SheetTitle>Add Banner</SheetTitle>
          <SheetDescription>Add a new banner</SheetDescription>
        </SheetHeader>
        <BannerForm />
      </SheetContent>
    </Sheet>
  );
}
