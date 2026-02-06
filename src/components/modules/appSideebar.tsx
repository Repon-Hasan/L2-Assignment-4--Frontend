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
  DollarSign,
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

// Use uppercase to match DashboardLayout
type UserRole = "ADMIN" | "SELLER" | "CUSTOMER";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userRole?: UserRole;
}

/* =====================
   Navigation Items
===================== */
const CUSTOMER_NAV_ITEMS = [
  { title: "Dashboard", url: "/dashboard", icon: SquareTerminal },
  { title: "My Cart", url: "/dashboard/cart", icon: ShoppingCart },
  { title: "My Orders", url: "/dashboard/orders", icon: Package },
  { title: "My Reviews", url: "/dashboard/reviews", icon: Star },
  { title: "Profile", url: "/dashboard/profile", icon: Settings },
];

const SELLER_NAV_ITEMS = [
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

const ADMIN_NAV_ITEMS = [
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

/* =====================
   Component
===================== */
export default function AppSidebar({
  userRole = "CUSTOMER",
  ...props
}: AppSidebarProps) {
  // Normalize role just in case
  const role = userRole.toUpperCase() as UserRole;
console.log("UserRoll",role)
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
      className="bg-white border-r border-gray-200"
    >
      {/* Logo */}
      <SidebarHeader className="border-b border-gray-200">
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
                    className="flex items-center gap-2 font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md px-2 py-1"
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
                      className={`flex items-center gap-2 text-sm px-4 py-1 rounded-md hover:bg-blue-50 ${
                        isActive(sub.url)
                          ? "bg-blue-100 text-blue-600 font-semibold"
                          : "text-gray-600"
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
                href={item.url}
                className={`flex items-center gap-2 text-sm px-4 py-2 rounded-md hover:bg-blue-50 ${
                  isActive(item.url)
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : "text-gray-700"
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
      <SidebarFooter className="border-t border-gray-200 p-3">
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600"
        >
          <Settings size={16} />
          Profile
        </Link>
        <button
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-red-600 mt-2"
          onClick={() => alert("Logging out...")}
        >
          <LogOut size={16} />
          Logout
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}

/* =====================
   Logo Header
===================== */
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
