"use client";

import { motion } from "framer-motion";
import {
  Truck,
  ShieldCheck,
  CreditCard,
  Clock,
  BadgeCheck,
  Lock,
} from "lucide-react";

const features = [
  {
    title: "Fast Delivery",
    desc: "Get medicines delivered within 24 hours anywhere in the country.",
    extra: "Same-day delivery in major cities",
    icon: Truck,
    badge: "24h",
    highlight: Clock,
  },
  {
    title: "Verified Sellers",
    desc: "100% trusted and government-verified pharmacies only.",
    extra: "Licensed & quality-checked",
    icon: ShieldCheck,
    badge: "Trusted",
    highlight: BadgeCheck,
  },
  {
    title: "Secure Payment",
    desc: "End-to-end encrypted payments with full privacy protection.",
    extra: "SSL & PCI-DSS compliant",
    icon: CreditCard,
    badge: "Safe",
    highlight: Lock,
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
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120 },
  },
};

export default function Features() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50 dark:from-zinc-950 dark:to-zinc-900 transition-colors">
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Why Choose Us
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            A modern, reliable and secure platform built for your health and
            peace of mind.
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
            const Highlight = item.highlight;

            return (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="group relative bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-zinc-800"
              >
                {/* Badge */}
                <span className="absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                  {item.badge}
                </span>

                {/* Icon */}
                <div className="relative w-16 h-16 mb-6 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:bg-blue-600 transition">
                  <Icon className="w-8 h-8 text-blue-600 group-hover:text-white transition" />

                  {/* Glow */}
                  <div className="absolute inset-0 rounded-2xl bg-blue-500 opacity-0 group-hover:opacity-20 blur-xl transition" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  {item.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  {item.desc}
                </p>

                {/* Extra info */}
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Highlight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>{item.extra}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
