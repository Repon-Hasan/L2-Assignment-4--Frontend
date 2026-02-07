"use client"; // ✅ Important: prevents prerendering error

import React from "react";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="h-[80vh] flex justify-center items-center">
      <LoginForm />
    </div>
  );
}
