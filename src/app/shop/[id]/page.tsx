"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { format } from "date-fns";
import Link from "next/link";

interface Product {
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

export default function ShopDetailsPage() {
  const params = useParams();
  const id = params?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:4000/shop/single/${id}`, {
          cache: "no-store",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Product not found");
        }

        const data = await res.json();
        setProduct(data.data);
      } catch (err: any) {
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleBuyNow = async () => {
    if (!product) return;

    const result = await Swal.fire({
      title: "Confirm Purchase",
      html: `
        <div style="text-align:left">
          <p><b>Medicine:</b> ${product.name}</p>
          <p><b>Brand:</b> ${product.brand}</p>
          <p><b>Category:</b> ${product.category}</p>
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
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Please try again later",
      });
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-600">{error}</div>;
  if (!product) return <div className="text-center py-20 text-red-600">Product not found</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-10 px-4 md:px-0"
    >
      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Product Image */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex justify-center"
        >
          <Image
            src={product.image}
            alt={product.name}
            width={350}
            height={350}
            className="rounded-xl object-contain shadow-lg"
          />
        </motion.div>

        {/* Product Info */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>

          <div className="flex gap-4 flex-wrap">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              Brand: {product.brand}
            </span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              Category: {product.category}
            </span>
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
              Stock: {product.stock}
            </span>
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
              Expiry: {format(new Date(product.expiryDate), "dd MMM yyyy")}
            </span>
          </div>

          <p className="text-2xl font-bold text-blue-600 mt-4">
            ${product.price}
          </p>

          <button
            onClick={handleBuyNow}
            className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Buy Now
          </button>

          <Link
            href="/shop"
            className="inline-block mt-2 text-blue-600 hover:underline"
          >
            ← Back to Shop
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
