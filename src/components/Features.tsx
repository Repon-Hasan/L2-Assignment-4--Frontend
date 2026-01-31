"use client";

import { motion } from "framer-motion";
import { Truck, ShieldCheck, CreditCard } from "lucide-react";

const features = [
  {
    title: "Fast Delivery",
    desc: "Get medicines delivered within 24 hours anywhere.",
    icon: Truck,
  },
  {
    title: "Verified Sellers",
    desc: "100% trusted and government-verified sellers.",
    icon: ShieldCheck,
  },
  {
    title: "Secure Payment",
    desc: "Encrypted payments with complete data protection.",
    icon: CreditCard,
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

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};

export default function Features() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose Us
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            We provide a reliable, fast, and secure medicine delivery
            experience you can trust.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {features.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
                whileHover={{ y: -8 }}
              >
                {/* Icon */}
                <div className="w-14 h-14 mb-6 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-600 transition">
                  <Icon className="text-blue-600 group-hover:text-white w-7 h-7" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
