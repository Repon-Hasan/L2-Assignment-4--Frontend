"use client";

import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";
export const dynamic = "force-dynamic";
export default function Page() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
