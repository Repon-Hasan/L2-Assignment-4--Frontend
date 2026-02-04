"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface ApiOrderItem {
  id: string;
  quantity: number;
  price: number;
  status: string;
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
  status: string;
  createdAt: string;
  items: {
    id: string;
    medicineName: string;
    quantity: number;
    price: number;
    status: string;
  }[];
}

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          "http://localhost:4000/api/orders/seller/bbb@gmail.com",
          { credentials: "include" }
        );

        const data = await res.json();
        if (!data.success) throw new Error("Failed");

        // 🔥 GROUP ORDER ITEMS BY ORDER ID
        const grouped: Record<string, SellerOrder> = {};

        (data.data as ApiOrderItem[]).forEach(item => {
          const orderId = item.order.id;

          if (!grouped[orderId]) {
            grouped[orderId] = {
              orderId,
              buyerEmail: item.order.user.email,
              shippingAddress: item.order.shippingAddress,
              status: item.order.status,
              createdAt: item.order.createdAt,
              items: [],
            };
          }

          grouped[orderId].items.push({
            id: item.id,
            medicineName: item.medicine.name,
            quantity: item.quantity,
            price: item.price,
            status: item.status,
          });
        });

        setOrders(Object.values(grouped));
      } catch {
        toast.error("Failed to load seller orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  
  if (loading) {
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

                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-700">
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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
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

                    <div className="text-right">
                      <p className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.status}
                      </p>
                    </div>
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
