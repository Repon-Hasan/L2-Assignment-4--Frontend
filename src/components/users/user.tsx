"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getCurrentUser, updateCurrentUser } from "@/services";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Load current user from backend (cookie session)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const current = await getCurrentUser();
        if (current) {
          setUser(current);
          setName(current.name);
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // 🔹 Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500">
        Loading profile...
      </div>
    );
  }

  // 🔹 Not logged in
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500">
        Not logged in
      </div>
    );
  }

  // 🔹 Update profile
  const handleUpdate = async () => {
    if (!name.trim()) {
      alert("Name cannot be empty");
      return;
    }

    try {
      setLoading(true);

      const res = await updateCurrentUser({ name });

      // backend returns { success, data }
      setUser(res.data);
      setIsEditing(false);
    } catch (err: any) {
      alert(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto mt-10"
    >
      <div className="rounded-2xl border bg-white dark:bg-zinc-900 shadow-sm p-8">
        {/* Header */}
        <div className="mb-6 border-b pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              User Profile
            </h1>
            <p className="text-sm text-gray-500">
              Account information & status
            </p>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* View Mode */}
        {!isEditing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ProfileItem label="Full Name" value={user.name} />
            <ProfileItem label="Email Address" value={user.email} />
            <ProfileItem label="Role" value={user.role} badge />
            <ProfileItem
              label="Email Verified"
              value={user.emailVerified ? "Verified" : "Not Verified"}
              status={user.emailVerified}
            />
            <ProfileItem
              label="Account Created"
              value={new Date(user.createdAt).toLocaleString()}
            />
            <ProfileItem
              label="Last Updated"
              value={new Date(user.updatedAt).toLocaleString()}
            />
          </div>
        ) : (
          /* Edit Mode */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Full Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email Address
              </label>
              <input
                value={user.email}
                disabled
                className="w-full rounded-lg border bg-gray-100 px-4 py-2 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">
                Email cannot be changed
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-lg border text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

/* ---------------- Reusable Item ---------------- */
function ProfileItem({
  label,
  value,
  badge,
  status,
}: {
  label: string;
  value: string;
  badge?: boolean;
  status?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide text-gray-500">
        {label}
      </span>

      {badge ? (
        <span className="w-fit rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-sm font-medium">
          {value}
        </span>
      ) : status !== undefined ? (
        <span
          className={`w-fit rounded-full px-3 py-1 text-sm font-medium ${
            status
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {value}
        </span>
      ) : (
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {value}
        </span>
      )}
    </div>
  );
}
