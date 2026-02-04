"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface Medicine {
  id: string;
  name: string;
  genericName?: string;
  brand?: string;
  category?: string;
  description?: string;
  price: number;
  discount: number;
  stock: number;
  expiryDate?: string;
  sellerEmail?: string;
  image?: string;
  status?: string;
}

export default function MyMedicines() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<string>("");

  // 🔹 Fetch current user
  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/me", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to get user");

      const data = await res.json();
      setCurrentUser(data.user.email);
    } catch (error: any) {
      toast.error(error.message || "Login required");
    }
  };

  // 🔹 Fetch seller medicines
  const fetchMedicines = async (email: string) => {
    try {
      const res = await fetch(`http://localhost:4000/shop/${email}`, {
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch medicines");

      setMedicines(data.data || []);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) fetchMedicines(currentUser);
  }, [currentUser]);

  if (loading) return <p className="text-center mt-10">Loading your medicines...</p>;

  if (medicines.length === 0)
    return <p className="text-center mt-10 text-gray-500">No medicines added yet.</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-6">My Medicines</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {medicines.map((med) => (
            <motion.div
              key={med.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              layout
              className="bg-white rounded-lg shadow p-4 flex flex-col"
            >
              {/* Image */}
              <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={med.image || "/avatar.png"}
                  alt={med.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <h3 className="font-semibold text-lg">{med.name}</h3>
              {med.genericName && (
                <p className="text-sm text-gray-500">{med.genericName}</p>
              )}
              <p className="text-sm text-gray-500">{med.brand}</p>
              <p className="text-sm text-gray-500">{med.category}</p>
              <p className="mt-1 text-sm text-gray-700 line-clamp-2">
                {med.description}
              </p>

              <div className="mt-2 flex items-center justify-between">
                <span className="text-green-600 font-medium">
                  ${med.price.toFixed(2)}
                </span>
                {med.discount > 0 && (
                  <span className="text-red-500 text-sm">-{med.discount}%</span>
                )}
              </div>

              <p className="text-sm text-gray-500 mt-1">Stock: {med.stock}</p>
              {med.expiryDate && (
                <p className="text-sm text-gray-500">
                  Expiry: {new Date(med.expiryDate).toLocaleDateString()}
                </p>
              )}

              <div className="mt-4 flex gap-2">
                <button
                  className="flex-1 bg-blue-600 text-white py-1 rounded hover:bg-blue-700 transition"
                  onClick={() => toast("Edit functionality coming soon")}
                >
                  Edit
                </button>
                <button
                  className="flex-1 bg-red-600 text-white py-1 rounded hover:bg-red-700 transition"
                  onClick={() => toast("Delete functionality coming soon")}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
