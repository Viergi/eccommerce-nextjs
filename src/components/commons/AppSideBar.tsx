"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Admin } from "@/lib/type";
import {
  LayoutDashboard,
  ListOrdered,
  Package,
  Palette,
  Shield,
  SquareDashedTopSolid,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "../ui/avatar";

export const adminPages = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Banner",
    url: "/admin/banner-settings",
    icon: SquareDashedTopSolid,
  },
  {
    title: "Admin Management",
    url: "/admin/manage-admin",
    icon: Shield,
  },
  {
    title: "User Management",
    url: "/admin/manage-user",
    icon: Users,
  },
  {
    title: "Product",
    url: "/admin/products",
    icon: Package,
  },
  {
    title: "Categories",
    url: "/admin/categories",
    icon: Palette,
  },
  {
    title: "Orders",
    url: "/admin/orders",
    icon: ListOrdered,
  },
  // {
  //   title: "Settings",
  //   url: "/admin/settings",
  //   icon: Settings,
  // },
];

export function AppSidebar({ admin }: { admin: Admin | null }) {
  const pathname = usePathname();

  return (
    <Sidebar className="bg-gray-50 border-r border-gray-200 dark:bg-zinc-900 dark:border-zinc-800">
      <SidebarHeader className="font-bold text-xl text-gray-800 dark:text-gray-100">
        Eco Shop Admin
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroupLabel className="text-sm font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
          Menu
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {adminPages.map((item) => {
              const isActive = pathname.includes(item.url);
              const Icon = item.icon;

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`
                      ${
                        isActive
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800"
                      }
                      flex items-center gap-3 p-3 transition-colors
                    `}
                  >
                    <Link
                      href={item.url}
                      className="w-full h-full flex items-center gap-3"
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>

      <SidebarFooter className="border-t p-4 flex dark:border-zinc-800">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="font-bold">{`${admin?.fullname[0].toUpperCase()}${admin?.fullname[
            admin.fullname.length - 1
          ].toUpperCase()}`}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            {admin?.fullname}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {admin?.level}
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
