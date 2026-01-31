"use client";
import { motion } from "framer-motion";

const reviews = [
  { name: "John Doe", comment: "Fast delivery and genuine products!" },
  { name: "Sarah Khan", comment: "Very easy to use and reliable." },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-10">
        What Our Customers Say
      </h2>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 px-4">
        {reviews.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="bg-white p-6 rounded-xl shadow"
          >
            <p className="italic">“{r.comment}”</p>
            <h4 className="mt-4 font-semibold">{r.name}</h4>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
