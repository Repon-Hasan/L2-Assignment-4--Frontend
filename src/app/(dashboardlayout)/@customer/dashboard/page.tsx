"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiShoppingBag, FiShoppingCart, FiPackage, FiUser } from "react-icons/fi";

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function CustomerDashboardHome() {
  const [orders, setOrders] = useState<Order[]>([]);

 useEffect(() => {
  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/orders", {
        credentials: "include", // important if using cookies auth
      });

      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await res.json();

      // ✅ backend sends { success, orders }
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Order fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, []);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status !== "DELIVERED").length;
  const deliveredOrders = orders.filter(o => o.status === "DELIVERED").length;
  const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome back 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your medicines, orders, and profile from here
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Total Orders", value: totalOrders },
          { label: "Pending Orders", value: pendingOrders },
          { label: "Delivered", value: deliveredOrders },
          { label: "Total Spent", value: `$${totalSpent.toFixed(2)}` },
        ].map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl shadow p-6"
          >
            <p className="text-gray-500">{stat.label}</p>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <QuickLink
          href="/shop"
          icon={<FiShoppingBag />}
          title="AllMedicines"
        />
        <QuickLink
          href="/dashboard/cart"
          icon={<FiShoppingCart />}
          title="My Cart"
        />
        <QuickLink
          href="/dashboard/orders"
          icon={<FiPackage />}
          title="My Orders"
        />
        <QuickLink
          href="/profile"
          icon={<FiUser />}
          title="My Profile"
        />
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>

        {orders.length === 0 ? (
          <p className="text-gray-500">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow p-5 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{order.id}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold">${order.totalAmount}</p>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      order.status === "DELIVERED"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
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

/* 🔹 Reusable Quick Link */
function QuickLink({
  href,
  icon,
  title,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-6 flex items-center gap-4 shadow cursor-pointer"
      >
        <div className="text-2xl">{icon}</div>
        <p className="font-semibold">{title}</p>
      </motion.div>
    </Link>
  );
}
