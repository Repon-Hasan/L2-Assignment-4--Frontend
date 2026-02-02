"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function MedicineCard({ product }: { product: any }) {
  const addToCart = async () => {
    console.log("click")
    try {
      const res = await fetch("http://localhost:4000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ send cookies for auth
        body: JSON.stringify({ medicineId: product.id }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Added to cart!");
      } else {
        toast.error(data.message || "Failed to add to cart");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-white rounded-3xl shadow-lg p-6 flex flex-col items-center"
    >
      {/* Medicine Image */}
      <Image
        width={144}
        height={144}
        src={product.image}
        alt={product.name}
        className="object-contain mb-4 rounded-lg"
      />

      {/* Medicine Info */}
      <h3 className="text-xl font-bold text-center">{product.name}</h3>
      <p className="text-gray-500 text-sm text-center mt-1">
        {product.description}
      </p>
      <p className="text-blue-600 font-bold mt-2">${product.price}</p>
      <p className="text-gray-400 text-sm mb-4">Stock: {product.stock}</p>

      {/* Buttons */}
      <div className="flex gap-3 w-full mt-auto">
        <button
          onClick={addToCart}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Buy Now
        </button>

        <Link
          href={`/shop/${product.id}`}
          className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg font-semibold text-center hover:bg-blue-50 transition"
        >
          Details
        </Link>
      </div>
    </motion.div>
  );
}
