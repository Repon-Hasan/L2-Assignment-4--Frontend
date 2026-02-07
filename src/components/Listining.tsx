"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const medicines = [
  {
    name: "Paracetamol",
    price: "$5",
    description: "Relieves pain and fever effectively",
    stock: 20,
    category: "Pain Relief",
    manufacturer: "ACME Pharma",
    expiry: "Dec 2026",
    image: "/images/paracetamol.jpg",
    rating: 4.5,
  },
  {
    name: "Aspirin",
    price: "$8",
    description: "Reduces inflammation and pain",
    stock: 15,
    category: "Anti-Inflammatory",
    manufacturer: "HealthCorp",
    expiry: "Aug 2025",
    image: "/images/Aspirin.jpg",
    rating: 4.2,
  },
  {
    name: "Vitamin C",
    price: "$6",
    description: "Boosts immunity and energy",
    stock: 30,
    category: "Supplements",
    manufacturer: "NutriLife",
    expiry: "Jan 2027",
    image: "/images/Vitamin C.jpg",
    rating: 4.8,
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export default function Listings() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-100 to-white dark:from-zinc-900 dark:to-zinc-950 transition-colors">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-bold text-center mb-14 text-gray-800 dark:text-white"
      >
        Popular Medicines
      </motion.h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4"
      >
        {medicines.map((med, i) => (
          <motion.div
            key={i}
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.04 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition flex flex-col"
          >
            {/* Image */}
            <div className="relative w-32 h-32 mx-auto mb-4">
              <Image
                src={med.image}
                alt={med.name}
                fill
                className="object-contain"
              />
            </div>

            {/* Info */}
            <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-white">
              {med.name}
            </h3>

            <p className="text-gray-500 dark:text-gray-400 text-sm text-center mt-1">
              {med.description}
            </p>

            {/* Extra Info */}
            <div className="mt-4 space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <p>
                <span className="font-medium">Category:</span> {med.category}
              </p>
              <p>
                <span className="font-medium">Manufacturer:</span>{" "}
                {med.manufacturer}
              </p>
              <p>
                <span className="font-medium">Expiry:</span> {med.expiry}
              </p>
              <p>
                <span className="font-medium">Stock:</span> {med.stock}
              </p>
            </div>

            {/* Price & Rating */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                {med.price}
              </p>

              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="text-yellow-500 font-semibold text-sm"
              >
                {"⭐".repeat(Math.floor(med.rating))}{" "}
                <span className="text-gray-500 dark:text-gray-400">
                  ({med.rating})
                </span>
              </motion.p>
            </div>

            {/* Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              className="mt-6 bg-blue-600 dark:bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition"
            >
              Buy Now
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
