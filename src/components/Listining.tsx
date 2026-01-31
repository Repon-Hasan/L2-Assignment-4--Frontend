"use client";
import { motion } from "framer-motion";

const medicines = [
  {
    name: "Paracetamol",
    price: "$5",
    description: "Relieves pain and fever",
    stock: 20,
    image: "/images/paracetamol.jpg",
    rating: 4.5,
  },
  {
    name: "Aspirin",
    price: "$8",
    description: "Reduces inflammation and pain",
    stock: 15,
    image: "/images/Aspirin.jpg",
    rating: 4.2,
  },
  {
    name: "Vitamin C",
    price: "$6",
    description: "Boosts immunity and energy",
    stock: 30,
    image: "/images/Vitamin C.jpg",
    rating: 4.8,
  },
];

export default function Listings() {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-100 to-white">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Popular Medicines
      </h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {medicines.map((med, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05, y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition relative flex flex-col items-center"
          >
            <div className="w-32 h-32 mb-4">
              <img
                src={med.image}
                alt={med.name}
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">{med.name}</h3>
            <p className="text-gray-500 text-sm text-center mb-2">
              {med.description}
            </p>
            <p className="text-blue-600 font-bold mb-2">{med.price}</p>
            <p className="text-gray-400 text-sm mb-2">Stock: {med.stock}</p>
            <p className="text-yellow-500 font-semibold mb-4">
              {"⭐".repeat(Math.floor(med.rating))} ({med.rating})
            </p>
            <button className="mt-auto bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
              Buy Now
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
