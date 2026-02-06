"use client";


import AppSidebar from "@/components/modules/appSideebar";
import { Navbar1 } from "@/components/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AppSidebar className="w-64 shrink-0" />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Top Navbar */}
        <Navbar1 />

        {/* Page Content */}
        <main className="flex-1  ml-0">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t bg-white text-center py-4 text-sm text-gray-500">
          © {new Date().getFullYear()} MediStore
        </footer>
      </div>
    </div>
  );
}
