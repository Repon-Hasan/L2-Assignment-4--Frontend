"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { toast } from "react-hot-toast";
import ReviewForm from "@/components/modules/ReviewForm";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  medicine: {
    id: string;
    name: string;
    image: string;
  };
}

interface Order {
  id: string;
  totalAmount: number;
  shippingAddress: string;
  createdAt: string;
  status: string;
  items?: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // 🔹 Load logged-in user
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/me", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Not authenticated");

        const data = await res.json();
        setUserId(data.user.id); // ✅ STRING
      } catch {
        toast.error("Please login");
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // 🔹 Fetch orders ONLY when userId is ready
  useEffect(() => {
    if (!userId) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/orders/user/${userId}`,
          { credentials: "include" }
        );

        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  // 🔹 Loader
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <motion.div
          className="h-10 w-10 rounded-full border-4 border-green-600 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 && (
        <p className="text-gray-500 text-center">
          You haven’t placed any orders yet.
        </p>
      )}

      <AnimatePresence>
        <div className="space-y-6">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow p-6"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="font-semibold">
                    Order ID:{" "}
                    <span className="text-gray-500">{order.id}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <p className="text-lg font-bold text-green-600">
                  ${order.totalAmount.toFixed(2)}
                </p>
              </div>

              <p className="text-sm mb-2">
                <span className="font-medium">Shipping:</span>{" "}
                {order.shippingAddress}
              </p>

              <p className="text-sm mb-4">
                <span className="font-medium">Status:</span>{" "}
                <span className="font-semibold">{order.status}</span>
              </p>

              {/* Items */}
              <div className="space-y-4">
                {(order.items ?? []).map((item) => (
                  <div key={item.id}>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-4 border rounded-lg p-3"
                    >
                      <Image
                        src={item.medicine.image}
                        alt={item.medicine.name}
                        width={56}
                        height={56}
                        className="rounded object-contain"
                      />

                      <div className="flex-1">
                        <p className="font-semibold">
                          {item.medicine.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${item.price} × {item.quantity}
                        </p>
                      </div>

                      <p className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </motion.div>

                    {order.status === "DELIVERED" && (
                      <div className="mt-3 ml-16">
                        <ReviewForm medicineId={item.medicine.id} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}
