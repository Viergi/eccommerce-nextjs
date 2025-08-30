import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eco Shop",
  description:
    "Eco Shop adalah sebuah platform e-commerce full-stack yang dibangun untuk mendemonstrasikan kapabilitas pengembangan web modern. Proyek ini berfokus pada pengalaman pengguna yang intuitif dan sistem manajemen admin yang efisien, dengan tema produk yang ramah lingkungan dan berkelanjutan.",
  keywords: [
    "e-commerce",
    "full-stack",
    "nextjs",
    "react",
    "typescript",
    "prisma",
    "postgresql",
    "shadcn-ui",
    "tailwind-css",
    "web-development",
    "online-shop",
    "portfolio-project",
    "sustainable-products",
    "admin-dashboard",
    "apiroutes",
    "many-to-many-relationship",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
