"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar1 } from "@/components/navbar";

interface Medicine {
  id: string;
  name: string;
  brand?: string;
  stock: number;
  price: number;
}

interface Revenue {
  totalRevenue: number;
  averageOrderValue: number;
  totalItemsSold: number;
}

interface AdminStats {
  users: {
    total: number;
    customers: number;
    sellers: number;
    admins: number;
    banned: number;
  };
  medicines: {
    total: number;
    active: number;
    outOfStock: number;
    data: Medicine[];
  };
  orders: {
    total: number;
    pending: number;
    shipped: number;
    delivered: number;
  };
  revenue: Revenue;
}

export default function AdminDashboardPage() {
 
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:4000/shop/admin/dashboard-stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include"
        });

        if (!res.ok) {
          throw new Error("Failed to load admin stats");
        }

        const data = await res.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  console.log("Stats is ",stats)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-medium animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
       <Navbar1></Navbar1>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Total Users" value={stats?.users.total} />
        <DashboardCard title="Total Sellers" value={stats?.users.sellers} />
        <DashboardCard title="Total Medicines" value={stats?.medicines.total} />
        <DashboardCard title="Total Orders" value={stats?.orders.total} />
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <DashboardCard title="Total Revenue" value={stats?.revenue.totalRevenue} isCurrency />
        <DashboardCard title="Average Order Value" value={stats?.revenue.averageOrderValue} isCurrency />
        <DashboardCard title="Total Items Sold" value={stats?.revenue.totalItemsSold} />
      </div>

      {/* Medicines Table */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">All Medicines</h2>
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Brand</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Stock</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <AnimatePresence>
                {stats?.medicines.data.map((med) => (
                  <motion.tr
                    key={med.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{med.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{med.brand || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{med.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${med.price.toFixed(2)}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Dashboard Card ---------------- */
function DashboardCard({ title, value, isCurrency }: { title: string; value?: number; isCurrency?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow p-6 flex flex-col"
    >
      <p className="text-sm text-gray-500 mb-2">{title}</p>
      <h2 className="text-3xl font-bold text-gray-800">
        {isCurrency ? `$${value?.toFixed(2)}` : value ?? 0}
      </h2>
    </motion.div>
  );
}
