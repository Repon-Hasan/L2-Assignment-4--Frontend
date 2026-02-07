"use client";

import { useEffect, useState } from "react";
import AppSidebar from "@/components/modules/appSideebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getCurrentUser } from "@/services";

interface DashboardLayoutProps {
  children?: React.ReactNode;      // ✅ REQUIRED by Next.js
  admin?: React.ReactNode;         // ✅ made optional
  seller?: React.ReactNode;        // ✅ made optional
  user?: React.ReactNode;          // ✅ made optional
  customer?: React.ReactNode;      // ✅ already optional
}

export default function DashboardLayout({
  admin,
  seller,
  user,
  customer,
}: DashboardLayoutProps) {
  const [role, setRole] = useState<"ADMIN" | "SELLER" | "CUSTOMER" | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const current = await getCurrentUser();

      if (current?.role) {
        const userRole = current.role.toUpperCase();
        setRole(userRole as "ADMIN" | "SELLER" | "CUSTOMER");
        console.log("User role from DB:", userRole);
      } else {
        setRole("CUSTOMER");
        console.log("No user logged in, defaulting to CUSTOMER");
      }
    };

    fetchUser();
  }, []);

  if (!role) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  const breadcrumbLabel =
    role === "ADMIN" ? "Admin" : role === "SELLER" ? "Seller" : "Customer";

  return (
    <SidebarProvider>
      <AppSidebar userRole={role} />

      <SidebarInset>
        <header className="sticky top-0 z-10 bg-background flex h-16 items-center justify-between px-4 border-b">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />

            <Breadcrumb className="hidden sm:flex">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>{breadcrumbLabel}</BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <main className="p-4 pt-6 min-h-[calc(100vh-4rem)] gradientBg">
          {role === "ADMIN"
            ? admin
            : role === "SELLER"
            ? seller
            : customer || user}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
