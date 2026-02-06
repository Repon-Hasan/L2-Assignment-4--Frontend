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
  const [currentUser, setCurrentUser] = useState("");

  const [editing, setEditing] = useState<Medicine | null>(null);
  const [form, setForm] = useState<Partial<Medicine>>({});

  // 🔹 Fetch current user
  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/me", {
        credentials: "include",
      });
      const data = await res.json();
      setCurrentUser(data.user.email);
    } catch {
      toast.error("Login required");
    }
  };

  // 🔹 Fetch seller medicines
  const fetchMedicines = async (email: string) => {
    try {
      const res = await fetch(`http://localhost:4000/shop/medicines`, {
        credentials: "include",
      });
      const data = await res.json();
      setMedicines(data.data || []);
    } catch {
      toast.error("Failed to load medicines");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this medicine?")) return;

    try {
      await fetch(`http://localhost:4000/shop/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setMedicines((prev) => prev.filter((m) => m.id !== id));
      toast.success("Medicine deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  // 🔹 Open edit modal
  const openEdit = (med: Medicine) => {
    setEditing(med);
    setForm({
      name: med.name,
      genericName: med.genericName,
      brand: med.brand,
      category: med.category,
      description: med.description,
      price: med.price,
      discount: med.discount,
      stock: med.stock,
      expiryDate: med.expiryDate?.split("T")[0],
      image: med.image,
      status: med.status,
    });
  };

  // 🔹 Update medicine (ALL FIELDS)
  const handleUpdate = async () => {
    if (!editing) return;

    try {
      const res = await fetch(`http://localhost:4000/shop/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          discount: Number(form.discount),
          stock: Number(form.stock),
          expiryDate: form.expiryDate
            ? new Date(form.expiryDate).toISOString()
            : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMedicines((prev) =>
        prev.map((m) => (m.id === editing.id ? data.data : m))
      );

      toast.success("Medicine updated");
      setEditing(null);
    } catch {
      toast.error("Update failed");
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) fetchMedicines(currentUser);
  }, [currentUser]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

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
              exit={{ opacity: 0 }}
              className="bg-white rounded-lg shadow p-4"
            >
              <div className="relative h-40 mb-3">
                <Image
                  src={med.image || "/avatar.png"}
                  alt={med.name}
                  fill
                  className="object-cover rounded"
                />
              </div>

              <h3 className="font-semibold">{med.name}</h3>
              <p className="text-sm text-gray-500">{med.brand}</p>
              <p className="text-sm text-gray-500">Stock: {med.stock}</p>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => openEdit(med)}
                  className="flex-1 bg-blue-600 text-white py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(med.id)}
                  className="flex-1 bg-red-600 text-white py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 🔹 Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-lg space-y-3">
            <h3 className="text-lg font-semibold">Edit Medicine</h3>

            {[
              ["name", "Name"],
              ["genericName", "Generic Name"],
              ["brand", "Brand"],
              ["category", "Category"],
              ["image", "Image URL"],
              ["status", "Status"],
            ].map(([key, label]) => (
              <input
                key={key}
                placeholder={label}
                value={(form as any)[key] || ""}
                onChange={(e) =>
                  setForm({ ...form, [key]: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
            ))}

            <textarea
              placeholder="Description"
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full border p-2 rounded"
            />

            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Price"
                value={form.price ?? ""}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value as any })
                }
                className="border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Discount"
                value={form.discount ?? ""}
                onChange={(e) =>
                  setForm({ ...form, discount: e.target.value as any })
                }
                className="border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Stock"
                value={form.stock ?? ""}
                onChange={(e) =>
                  setForm({ ...form, stock: e.target.value as any })
                }
                className="border p-2 rounded"
              />
              <input
                type="date"
                value={form.expiryDate || ""}
                onChange={(e) =>
                  setForm({ ...form, expiryDate: e.target.value })
                }
                className="border p-2 rounded"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-green-600 text-white py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(null)}
                className="flex-1 bg-gray-300 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
