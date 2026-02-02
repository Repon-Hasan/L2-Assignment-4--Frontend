"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function ReviewForm({ medicineId }: { medicineId: string }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submit = async () => {
    const res = await fetch("http://localhost:4000/api/reviews", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ medicineId, rating, comment }),
    });

    const data = await res.json();
    if (!res.ok) return toast.error(data.message);

    toast.success("Review added");
    setComment("");
  };

  return (
    <div className="border rounded-lg p-4 mt-3 bg-gray-50">
      <h4 className="font-semibold mb-2">Give Feedback</h4>

      <select
        className="border p-2 rounded w-full mb-2"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      >
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>
            {r} Stars
          </option>
        ))}
      </select>

      <textarea
        className="border p-2 rounded w-full mb-2"
        rows={3}
        placeholder="Your feedback..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button
        onClick={submit}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Submit Review
      </button>
    </div>
  );
}
