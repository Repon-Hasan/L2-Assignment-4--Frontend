"use client";

import { usePathname } from "next/navigation";
import { Navbar1 } from "@/components/navbar";
import Footer from "@/components/Footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 🔹 Hide navbar & footer on dashboard routes
  const hideLayout = pathname.startsWith("/dashboard");

  return (
    <>
      {!hideLayout && <Navbar1 />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}
