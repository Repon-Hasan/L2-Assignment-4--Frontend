"use client";

import * as React from "react";
import {
  SquareTerminal,
  Settings,
  Bot,
  Tag,
  File,
  ShoppingCart,
  Package,
  Star,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// --------------------------
// Types
// --------------------------
type UserRole = "ADMIN" | "SELLER" | "CUSTOMER";

type SidebarSubItem = {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
};

type SidebarItem = {
  title: string;
  icon: React.ComponentType<any>;
  url?: string; // optional if it has sub-items
  items?: SidebarSubItem[]; // optional
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userRole?: UserRole;
}

// --------------------------
// Sidebar Items
// --------------------------
const CUSTOMER_NAV_ITEMS: SidebarItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: SquareTerminal },
  { title: "My Cart", url: "/dashboard/cart", icon: ShoppingCart },
  { title: "My Orders", url: "/dashboard/orders", icon: Package },
  { title: "My Reviews", url: "/dashboard/reviews", icon: Star },
  { title: "Profile", url: "/dashboard/profile", icon: Settings },
];

const SELLER_NAV_ITEMS: SidebarItem[] = [
  { title: "Seller Dashboard", url: "/dashboard", icon: SquareTerminal },
  {
    title: "Medicines",
    icon: Bot,
    items: [
      { title: "Add Medicine", url: "/dashboard/add-medicine", icon: Tag },
      { title: "My Medicines", url: "/dashboard/my-medicines", icon: File },
    ],
  },
  { title: "Orders", url: "/dashboard/seller-orders", icon: Package },
];

const ADMIN_NAV_ITEMS: SidebarItem[] = [
  { title: "Admin Dashboard", url: "/dashboard", icon: SquareTerminal },
  { title: "Manage Users", url: "/dashboard/users", icon: Bot },
  {
    title: "Product Management",
    icon: Bot,
    items: [
      { title: "All Medicines", url: "/dashboard/all-medicines", icon: File },
      { title: "Manage Medicines", url: "/dashboard/manage-medicines", icon: File },
    ],
  },
  { title: "All Orders", url: "/dashboard/all-orders", icon: Package },
  { title: "Profile", url: "/dashboard/profile", icon: Settings },
];

// --------------------------
// Component
// --------------------------
export default function AppSidebar({
  userRole = "CUSTOMER",
  ...props
}: AppSidebarProps) {
  const role = userRole.toUpperCase() as UserRole;

  const navItems =
    role === "ADMIN"
      ? ADMIN_NAV_ITEMS
      : role === "SELLER"
      ? SELLER_NAV_ITEMS
      : CUSTOMER_NAV_ITEMS;

  const pathname = usePathname();
  const isActive = (url: string) => pathname === url;

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="bg-white border-r border-gray-200 dark:bg-zinc-900 dark:border-zinc-800"
    >
      {/* Logo */}
      <SidebarHeader className="border-b border-gray-200 dark:border-zinc-800">
        <LogoHeader />
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="flex flex-col gap-1 py-4">
        {navItems.map((item) =>
          item.items ? (
            <SidebarMenu key={item.title}>
              <>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    size="sm"
                    className="flex items-center gap-2 font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md px-2 py-1 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-zinc-800"
                  >
                    <item.icon size={18} />
                    {item.title}
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Subitems */}
                {item.items.map((sub) => (
                  <SidebarMenuItem key={sub.title}>
                    <Link
                      href={sub.url}
                      className={`flex items-center gap-2 text-sm px-4 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-zinc-800 ${
                        isActive(sub.url)
                          ? "bg-blue-100 text-blue-600 font-semibold dark:bg-zinc-700 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      <sub.icon size={16} />
                      {sub.title}
                    </Link>
                  </SidebarMenuItem>
                ))}
              </>
            </SidebarMenu>
          ) : (
            <SidebarMenuItem key={item.title}>
              <Link
                href={item.url!} // safe because non-subitem
                className={`flex items-center gap-2 text-sm px-4 py-2 rounded-md hover:bg-blue-50 dark:hover:bg-zinc-800 ${
                  isActive(item.url!)
                    ? "bg-blue-100 text-blue-600 font-semibold dark:bg-zinc-700 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                <item.icon size={18} />
                {item.title}
              </Link>
            </SidebarMenuItem>
          )
        )}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-gray-200 dark:border-zinc-800 p-3">
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
        >
          <Settings size={16} />
          Profile
        </Link>
        <button
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-red-600 mt-2 dark:text-gray-300 dark:hover:text-red-500"
          onClick={() => alert("Logging out...")}
        >
          <LogOut size={16} />
          Logout
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}

// --------------------------
// Logo Header
// --------------------------
function LogoHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <Link href="/" className="relative h-12 w-full">
            <Image
              src="/logo.png"
              alt="SwiftCart Logo"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 7rem, (max-width: 1024px) 10rem, 12rem"
              priority
            />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
