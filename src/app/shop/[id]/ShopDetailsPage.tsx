"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Swal from "sweetalert2";
import { format } from "date-fns";
import Link from "next/link";

interface Medicine {
  id: string;
  name: string;
  genericName: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  expiryDate: string;
  sellerEmail: string;
  image: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function ShopDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, setProduct] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/shop/single/${params.id}`,
          { cache: "no-store", credentials: "include" }
        );
        const data = await res.json();
        setProduct(data.data);
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Failed to load product",
          text: "Please try again later",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.id]);

  const addToCart = async () => {
    if (!product) return;

    const result = await Swal.fire({
      title: "Confirm Purchase",
      html: `
        <div style="text-align:left">
          <p><b>Medicine:</b> ${product.name}</p>
          <p><b>Price:</b> $${product.price}</p>
          <p><b>Stock:</b> ${product.stock}</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Buy Now",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch("http://localhost:4000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ medicineId: product.id }),
      });
      const data = await res.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Added to Cart 🛒",
          text: "Medicine added successfully",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: data.message || "Failed to add to cart",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Please try again later",
      });
    }
  };

  if (loading)
    return <div className="text-center py-20 text-gray-500">Loading...</div>;

  if (!product)
    return (
      <div className="text-center py-20 text-red-600">Product not found</div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-10"
    >
      <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-start">
        {/* Product Image */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex justify-center lg:w-1/3"
        >
          <Image
            src={product.image}
            alt={product.name}
            width={350}
            height={350}
            className="rounded-xl shadow-lg"
          />
        </motion.div>

        {/* Product Details */}
        <div className="lg:w-2/3 flex flex-col gap-4">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-gray-500">
            <span className="font-semibold">Generic Name:</span>{" "}
            {product.genericName}
          </p>
          <p className="text-gray-500">
            <span className="font-semibold">Brand:</span> {product.brand}
          </p>
          <p className="text-gray-500">
            <span className="font-semibold">Category:</span> {product.category}
          </p>
          <p className="text-gray-500">
            <span className="font-semibold">Description:</span>{" "}
            {product.description}
          </p>
          <p className="text-gray-500">
            <span className="font-semibold">Expiry Date:</span>{" "}
            {format(new Date(product.expiryDate), "MMM dd, yyyy")}
          </p>
          <p className="text-gray-500">
            <span className="font-semibold">Seller Email:</span>{" "}
            {product.sellerEmail}
          </p>
          <p className="text-gray-800 text-2xl font-bold mt-2">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-gray-400">Stock: {product.stock}</p>

          <div className="flex gap-4 mt-4">
            <button
              onClick={addToCart}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Buy Now
            </button>

            <Link
              href="/shop"
              className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
