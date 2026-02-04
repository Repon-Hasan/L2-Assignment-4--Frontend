"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface User {
  id: string;
  name?: string;
  email: string;
  role: "CUSTOMER" | "SELLER";
  status: "ACTIVE" | "BANNED";
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/users", {
        credentials: "include",
      });

      const data = await res.json();
      //console.log("data",data.user)
      if (!res.ok) throw new Error(data.message || "Failed to fetch users");

      setUsers(data.user || []);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  //console.log(users)

  // 🔹 Ban / Unban
  const toggleStatus = async (user: User) => {
    const newStatus = user.status === "ACTIVE" ? "BANNED" : "ACTIVE";

    try {
      const res = await fetch(
        `http://localhost:4000/api/users/${user.id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, status: newStatus } : u
        )
      );

      toast.success(
        `User ${newStatus === "BANNED" ? "banned" : "unbanned"} successfully`
      );
    } catch (error: any) {
      toast.error(error.message || "Action failed");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <motion.div
          className="h-10 w-10 rounded-full border-4 border-blue-600 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

      {users.length === 0 && (
        <p className="text-center text-gray-500">No users found</p>
      )}

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <AnimatePresence>
            <tbody>
              {users.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4 font-medium">
                    {user.name || "—"}
                  </td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          user.role === "SELLER"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-green-100 text-green-700"
                        }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          user.status === "ACTIVE"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                        }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => toggleStatus(user)}
                      className={`px-4 py-1 rounded text-white transition
                        ${
                          user.status === "ACTIVE"
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                    >
                      {user.status === "ACTIVE" ? "Ban" : "Unban"}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </AnimatePresence>
        </table>
      </div>
    </div>
  );
}
