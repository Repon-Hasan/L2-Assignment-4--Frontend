"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

interface Review {
  id: string;
  medicineId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Medicine {
  id: string;
  name: string;
  brand: string;
  image: string;
  price: number;
}

interface ReviewWithMedicine extends Review {
  medicine?: Medicine;
}

export default function MyReviews() {
  const [reviews, setReviews] = useState<ReviewWithMedicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [reviewRes, medicineRes] = await Promise.all([
          fetch("http://localhost:4000/api/reviews/my-review", {
            credentials: "include",
          }),
          fetch("http://localhost:4000/shop/medicines"),
        ]);

        if (!reviewRes.ok) throw new Error("Failed to load reviews");

        const reviewsData: Review[] = await reviewRes.json();
        const medicinesData = (await medicineRes.json()).data as Medicine[];

        // 🔗 Attach medicine info to each review
        const combined = reviewsData.map((review) => ({
          ...review,
          medicine: medicinesData.find(
            (med) => med.id === review.medicineId
          ),
        }));

        setReviews(combined);
      } catch (err: any) {
        toast.error(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="py-10 text-center text-gray-500">
        Loading your reviews...
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="py-10 text-center text-gray-500">
        You haven’t reviewed any medicines yet.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-6">My Reviews</h2>

      <div className="grid md:grid-cols-2 gap-5">
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border p-4 flex gap-4 hover:shadow-md transition"
          >
            {/* Medicine image */}
            <div className="w-24 h-24 relative shrink-0">
              <Image
                src={review.medicine?.image || "/placeholder.png"}
                alt={review.medicine?.name || "Medicine"}
                fill
                className="rounded-lg object-cover"
              />
            </div>

            {/* Review content */}
            <div className="flex-1">
              <h3 className="font-semibold text-lg">
                {review.medicine?.name}
              </h3>

              <p className="text-sm text-gray-500 mb-1">
                {review.medicine?.brand}
              </p>

              {/* Stars */}
              <div className="text-yellow-500 text-sm mb-1">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </div>

              <p className="text-sm text-gray-700 mb-2">
                {review.comment}
              </p>

              <p className="text-xs text-gray-400">
                Reviewed on{" "}
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
