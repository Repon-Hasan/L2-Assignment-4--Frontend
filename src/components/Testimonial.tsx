"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star, BadgeCheck } from "lucide-react";

const reviews = [
  {
    name: "John Doe",
    comment:
      "Fast delivery and genuine products. The service exceeded my expectations!",
    avatar: "/images/user1.jpg",
    role: "Customer",
    rating: 5,
    since: "2023",
  },
  {
    name: "Sarah Khan",
    comment:
      "Very easy to use and reliable platform. Ordering medicines has never been easier.",
    avatar: "/images/user2.jpg",
    role: "Customer",
    rating: 4,
    since: "2022",
  },
  {
    name: "Ali Reza",
    comment:
      "Amazing support and quick response. Everything arrived perfectly packaged.",
    avatar: "/images/user3.jpg",
    role: "Customer",
    rating: 5,
    since: "2024",
  },
  {
    name: "Fatima Noor",
    comment:
      "Secure payment and fast delivery. I feel confident using this service.",
    avatar: "/images/user4.jpg",
    role: "Customer",
    rating: 5,
    since: "2023",
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.2 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120 },
  },
};

export default function Testimonials() {
  return (
    <section className="relative py-24 bg-gradient-to-br from-blue-50 to-white dark:from-zinc-950 dark:to-zinc-900 overflow-hidden transition-colors">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10 opacity-20 dark:opacity-10">
        <Image
          src="/images/testimonial-bg.jpg"
          alt="Testimonials background"
          fill
          className="object-cover"
        />
      </div>

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
            What Our Customers Say
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Trusted by thousands of customers for safe, fast, and reliable
            medicine delivery.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              className="group bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-md hover:shadow-2xl transition-all border border-gray-100 dark:border-zinc-800 flex flex-col items-center text-center"
            >
              {/* Avatar */}
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-200 dark:border-blue-800 group-hover:border-blue-500 transition">
                  <Image
                    src={r.avatar}
                    alt={r.name}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </div>

                {/* Verified badge */}
                <span className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1">
                  <BadgeCheck className="w-4 h-4 text-white" />
                </span>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, idx) => (
                  <Star
                    key={idx}
                    className={`w-4 h-4 ${
                      idx < r.rating
                        ? "text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                    fill={idx < r.rating ? "currentColor" : "none"}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-gray-700 dark:text-gray-300 italic mb-4">
                “{r.comment}”
              </p>

              {/* Name */}
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {r.name}
              </h4>

              <span className="text-sm text-blue-600 dark:text-blue-400">
                {r.role} • Since {r.since}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
