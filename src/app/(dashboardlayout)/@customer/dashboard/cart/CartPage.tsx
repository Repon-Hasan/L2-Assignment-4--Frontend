"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { toast } from "react-hot-toast";

interface CartItem {
  id: string;
  medicine: {
    id: string;
    name: string;
    image: string;
    price: number;
  };
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart
  const fetchCart = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/cart", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setCartItems(data.cart.items);
      } else {
        toast.error(data.message || "Failed to load cart");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Update quantity (+ / -)
  const updateQuantity = async (medicineId: string, quantity: number) => {
    if (quantity < 1) return;

    try {
      const res = await fetch(
        `http://localhost:4000/api/cart/update/${medicineId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ quantity }),
        }
      );

      const data = await res.json();
      if (data.success) {
        setCartItems(data.cart.items);
      } else {
        toast.error(data.message || "Failed to update quantity");
      }
    } catch {
      toast.error("Server error");
    }
  };

  // Remove item
  const removeItem = async (medicineId: string) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/cart/remove/${medicineId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();
      if (data.success) {
        setCartItems(data.cart.items);
        toast.success("Item removed");
      } else {
        toast.error(data.message || "Failed to remove item");
      }
    } catch {
      toast.error("Server error");
    }
  };

  // Place order
  const placeOrder = async () => {
    if (cartItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    const shippingAddress = prompt("Enter shipping address");
    if (!shippingAddress) return;

    try {
      const res = await fetch("http://localhost:4000/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ shippingAddress }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Order placed successfully!");
        setCartItems([]);
      } else {
        toast.error(data.message || "Failed to place order");
      }
    } catch {
      toast.error("Server error");
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.medicine.price * item.quantity,
    0
  );

  if (loading) return <p>Loading cart...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">My Cart</h2>

      {cartItems.length === 0 && (
        <p className="text-gray-500 text-center">Your cart is empty</p>
      )}

      <div className="flex flex-col gap-4">
        {cartItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between bg-white rounded-xl p-4 shadow"
          >
            <div className="flex items-center gap-4">
              <Image
                src={item.medicine.image}
                alt={item.medicine.name}
                width={64}
                height={64}
                className="rounded-lg object-contain"
              />

              <div>
                <h3 className="font-semibold">{item.medicine.name}</h3>
                <p className="text-gray-500">
                  ${item.medicine.price.toFixed(2)}
                </p>

                {/* Quantity Control */}
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.medicine.id, item.quantity - 1)
                    }
                    className="px-3 py-1 bg-gray-200 rounded font-bold"
                  >
                    −
                  </button>

                  <span className="font-semibold">{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQuantity(item.medicine.id, item.quantity + 1)
                    }
                    className="px-3 py-1 bg-gray-200 rounded font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => removeItem(item.medicine.id)}
              className="text-red-600 font-semibold hover:underline"
            >
              Remove
            </button>
          </motion.div>
        ))}
      </div>

      {cartItems.length > 0 && (
        <div className="mt-6 flex justify-between items-center bg-gray-100 p-4 rounded-xl">
          <p className="font-semibold text-lg">
            Total: ${totalPrice.toFixed(2)}
          </p>
          <button
            onClick={placeOrder}
            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition font-semibold"
          >
            Place Order (COD)
          </button>
        </div>
      )}
    </div>
  );
}
