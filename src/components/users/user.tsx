"use client";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/services";

export default function Profile() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const current = getCurrentUser();
    setUser(current);
  }, []);

  if (!user) return <p>Not logged in</p>;

  return (
    <div>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <p>Created At: {new Date(user.createdAt).toLocaleString()}</p>
      <p>Updated At: {new Date(user.updatedAt).toLocaleString()}</p>
      <p>Email Verified: {user.emailVerified ? "Yes" : "No"}</p>
    </div>
  );
}
