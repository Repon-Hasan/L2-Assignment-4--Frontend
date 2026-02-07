"use client"; // ✅ Must be first line

import React from "react";
import LoginForm from "@/components/LoginForm";

export default function Page() { // must be "Page"
  return (
    <div className="h-[80vh] flex justify-center items-center">
      <LoginForm />
    </div>
  );
}
