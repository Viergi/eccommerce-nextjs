"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";

interface ConfirmationDialogProps {
  // Trigger (Pemicu) sekarang diterima melalui children
  children: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  onConfirm: () => void; // Aksi yang dijalankan saat konfirmasi
  cancelText?: string;
  confirmText?: string;
  variant?: "default" | "destructive";
}

export default function ConfirmationDialog({
  children,
  title,
  variant = "default",
  description,
  onConfirm,
  cancelText = "Cancel",
  confirmText = "Continue",
}: ConfirmationDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={variant}>{children}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
