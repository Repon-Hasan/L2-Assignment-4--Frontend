"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const reviews = [
  {
    name: "John Doe",
    comment: "Fast delivery and genuine products! Highly recommend to everyone.",
    avatar: "/images/user1.jpg",
    role: "Customer",
  },
  {
    name: "Sarah Khan",
    comment: "Very easy to use and reliable platform. Great experience!",
    avatar: "/images/user2.jpg",
    role: "Customer",
  },
  {
    name: "Ali Reza",
    comment: "Amazing service and quick support. The app is very intuitive.",
    avatar: "/images/user3.jpg",
    role: "Customer",
  },
  {
    name: "Fatima Noor",
    comment: "Reliable, secure, and fast delivery. Absolutely love it!",
    avatar: "/images/user4.jpg",
    role: "Customer",
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.2 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};

export default function Testimonials() {
  return (
    <section className="relative py-20 bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
      {/* Decorative background image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/testimonial-bg.jpg"
          alt="Testimonials background"
          fill
          className="object-cover opacity-20"
        />
      </div>

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
            What Our Customers Say
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            See why thousands trust us for their medicine delivery and online
            pharmacy needs.
          </p>
        </motion.div>

        {/* Testimonial Cards */}
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
              whileHover={{ y: -5, scale: 1.03 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl border border-gray-100 flex flex-col items-center text-center"
            >
              {/* Avatar */}
              <div className="w-20 h-20 mb-4 rounded-full overflow-hidden border-2 border-blue-200">
                <Image
                  src={r.avatar}
                  alt={r.name}
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </div>

              {/* Comment */}
              <p className="italic text-gray-700 mb-4">“{r.comment}”</p>

              {/* Name & role */}
              <h4 className="font-semibold">{r.name}</h4>
              <span className="text-blue-600 text-sm">{r.role}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
