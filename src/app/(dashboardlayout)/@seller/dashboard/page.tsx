"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  FiPackage,
  FiShoppingBag,
  FiClock,
  FiDollarSign,
} from "react-icons/fi";
import { Navbar1 } from "@/components/navbar";

interface Medicine {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface RecentOrder {
  id: string;
  customerName: string;
  totalAmount: number;
  status: string;
}

interface Stats {
  totalMedicines: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
}

export default function SellerDashboardPage() {
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalMedicines: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch logged-in seller
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/me", {
          credentials: "include",
        });
        const data = await res.json();
        setCurrentUserEmail(data.user.email);
      } catch {
        toast.error("Login required");
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // 🔹 Fetch seller medicines & stats
  useEffect(() => {
    if (!currentUserEmail) return;

    const fetchSellerData = async () => {
      try {
        // Fetch medicines
        const resMedicines = await fetch(
          `http://localhost:4000/shop/${currentUserEmail}`,
          { credentials: "include" }
        );
        const dataMedicines = await resMedicines.json();
        setMedicines(dataMedicines.data || []);

        // Compute stats
        const totalOrders = dataMedicines.data?.reduce((acc: number, med: any) => {
          return acc + (med.ordersCount ?? 0);
        }, 0) || 0;

        const pendingOrders = dataMedicines.data?.reduce((acc: number, med: any) => {
          return acc + (med.pendingOrders ?? 0);
        }, 0) || 0;

        const totalRevenue = dataMedicines.data?.reduce((acc: number, med: any) => {
          return acc + (med.totalRevenue ?? 0);
        }, 0) || 0;

        setStats({
          totalMedicines: dataMedicines.data?.length || 0,
          totalOrders,
          pendingOrders,
          totalRevenue,
        });

        // Fetch recent orders
        const resOrders = await fetch(
          `http://localhost:4000/seller/orders/${currentUserEmail}`,
          { credentials: "include" }
        );
        const dataOrders = await resOrders.json();
        setRecentOrders(dataOrders.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load seller data");
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [currentUserEmail]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <motion.div
          className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
        <Navbar1></Navbar1>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Seller Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage your medicines and track orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Medicines" value={stats.totalMedicines} icon={<FiPackage />} color="bg-blue-500" />
        <StatCard title="Total Orders" value={stats.totalOrders} icon={<FiShoppingBag />} color="bg-green-500" />
        <StatCard title="Pending Orders" value={stats.pendingOrders} icon={<FiClock />} color="bg-yellow-500" />
        <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} icon={<FiDollarSign />} color="bg-purple-500" />
      </div>

      {/* Medicines Table */}
      <div className="bg-white rounded-xl shadow p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">Your Medicines</h2>
        {medicines.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No medicines found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Stock</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((med) => (
                  <tr key={med.id} className="border-b">
                    <td className="px-4 py-2">{med.name}</td>
                    <td className="px-4 py-2">${med.price}</td>
                    <td className="px-4 py-2">{med.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No recent orders</p>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center border rounded-lg p-4"
              >
                <div>
                  <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-500">Customer: {order.customerName}</p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">${order.totalAmount.toFixed(2)}</p>
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${
                      order.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "DELIVERED"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------
   Reusable Stat Card Component
--------------------------------*/
function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
      <div className={`h-12 w-12 flex items-center justify-center text-white rounded-lg ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </motion.div>
  );
}
