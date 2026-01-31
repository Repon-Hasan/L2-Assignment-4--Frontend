"use client";
import { motion } from "framer-motion";

const medicines = [
  { name: "Paracetamol", price: "$5" },
  { name: "Aspirin", price: "$8" },
  { name: "Vitamin C", price: "$6" },
];

export default function Listings() {
  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-center mb-10">
        Popular Medicines
      </h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {medicines.map((med, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="border rounded-xl p-6 text-center shadow-sm"
          >
            <h3 className="text-xl font-semibold">{med.name}</h3>
            <p className="text-blue-600 font-bold mt-2">{med.price}</p>
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
              Buy Now
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
