"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { getCurrentUser } from "@/services";

/* ================= TYPES ================= */

type OrderStatus = "PENDING" | "SHIPPED" | "DELIVERED";

interface ApiOrderItem {
  id: string;
  quantity: number;
  price: number;
  status: OrderStatus;
  medicine: {
    name: string;
  };
  order: {
    id: string;
    shippingAddress: string;
    status: string;
    createdAt: string;
    user: {
      email: string;
    };
  };
}

interface SellerOrder {
  orderId: string;
  buyerEmail: string;
  shippingAddress: string;
  status: OrderStatus;
  createdAt: string;
  items: {
    id: string;
    medicineName: string;
    quantity: number;
    price: number;
    status: OrderStatus;
  }[];
}

/* ================= COMPONENT ================= */

export default function SellerOrdersPage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  /* ================= LOAD CURRENT USER ================= */

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const current = await getCurrentUser();
        if (!current?.email) {
          toast.error("Not authenticated");
          return;
        }
        setUser(current);
      } catch {
        toast.error("Failed to load user");
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  /* ================= LOAD SELLER ORDERS ================= */

  useEffect(() => {
    if (!user?.email) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/orders/seller/${user.email}`,
          { credentials: "include" }
        );

        const data = await res.json();
        if (!data.success) throw new Error("Failed");

        const grouped: Record<string, SellerOrder> = {};

        (data.data as ApiOrderItem[]).forEach(item => {
          const orderId = item.order.id;

          if (!grouped[orderId]) {
            grouped[orderId] = {
              orderId,
              buyerEmail: item.order.user.email,
              shippingAddress: item.order.shippingAddress,
              status: item.order.status as OrderStatus,
              createdAt: item.order.createdAt,
              items: [],
            };
          }

          grouped[orderId].items.push({
            id: item.id,
            medicineName: item.medicine.name,
            quantity: item.quantity,
            price: item.price,
            status: item.status as OrderStatus,
          });
        });

        setOrders(Object.values(grouped));
      } catch {
        toast.error("Failed to load seller orders");
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [user?.email]);

  /* ================= UPDATE ORDER ITEM STATUS ================= */

  const updateItemStatus = async (
    orderItemId: string,
    status: OrderStatus
  ) => {
    try {
      const res = await fetch(
        `http://localhost:4000/shop/order-item/${orderItemId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();

      if (!data.success) throw new Error("Update failed");

      const newOrderStatus: OrderStatus = data.data.orderStatus;

      toast.success("Order status updated");

      // 🔥 Update UI: both item and order status
      setOrders(prev =>
        prev.map(order => {
          const hasItem = order.items.some(i => i.id === orderItemId);
          if (!hasItem) return order;

          return {
            ...order,
            status: newOrderStatus,
            items: order.items.map(item =>
              item.id === orderItemId
                ? { ...item, status }
                : item
            ),
          };
        })
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  /* ================= LOADING UI ================= */

  if (loadingUser || loadingOrders) {
    return (
      <div className="flex justify-center py-24">
        <motion.div
          className="h-10 w-10 rounded-full border-4 border-green-600 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8"
      >
        Seller Orders
      </motion.h1>

      {orders.length === 0 && (
        <p className="text-center text-gray-500">
          No orders for your medicines yet.
        </p>
      )}

      <AnimatePresence>
        <div className="space-y-6">
          {orders.map(order => (
            <motion.div
              key={order.orderId}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              {/* HEADER */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold">
                    Order ID:
                    <span className="text-gray-500 ml-1">
                      {order.orderId}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Buyer: {order.buyerEmail}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  order.status === "DELIVERED"
                    ? "bg-green-100 text-green-700"
                    : order.status === "SHIPPED"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {order.status}
                </span>
              </div>

              <p className="text-sm mb-4">
                <span className="font-medium">Shipping:</span>{" "}
                {order.shippingAddress}
              </p>

              {/* ITEMS */}
              <div className="space-y-3">
                {order.items.map(item => (
                  <motion.div
                    key={item.id}
                    className="flex justify-between items-center border rounded-lg p-4"
                  >
                    <div>
                      <p className="font-semibold">
                        {item.medicineName}
                      </p>
                      <p className="text-sm text-gray-500">
                        ${item.price} × {item.quantity}
                      </p>
                    </div>

                    {/* ✅ STATUS CHANGE */}
                    <select
                      value={item.status}
                      onChange={e =>
                        updateItemStatus(item.id, e.target.value as OrderStatus)
                      }
                      className="border rounded px-3 py-1 text-sm"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                    </select>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}
