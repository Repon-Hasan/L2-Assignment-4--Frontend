// components/ProductCard.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function MedicineCard({ product }: { product: any }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-white rounded-3xl shadow-lg p-6 flex flex-col items-center"
    >
      <Image
        width={144}
        height={144}
        src={product.image}
        alt={product.name}
        className="object-contain mb-4 rounded-lg"
      />

      <h3 className="text-xl font-bold text-center">{product.name}</h3>
      <p className="text-gray-500 text-sm text-center mt-1">
        {product.description}
      </p>

      <p className="text-blue-600 font-bold mt-2">${product.price}</p>
      <p className="text-gray-400 text-sm mb-4">Stock: {product.stock}</p>

      <div className="flex gap-3 mt-auto w-full">
        <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
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
