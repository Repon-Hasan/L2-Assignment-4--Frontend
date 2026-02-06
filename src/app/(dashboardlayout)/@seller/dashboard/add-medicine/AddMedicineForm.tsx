"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import Image from "next/image";
import { toast } from "sonner";

interface MedicineFormData {
  name: string;
  genericName?: string;
  brand?: string;
  category?: string;
  description?: string;
  price: number;
  discount: number;
  stock: number;
  expiryDate?: string;
  image?: string;
}

export default function AddMedicineForm() {
  const [sellerEmail, setSellerEmail] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MedicineFormData>();

  // 👤 Load current seller
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/me", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Not authenticated");

        const seller = await res.json();
        setSellerEmail(seller.user.email);
      } catch {
        toast.error("Please login as seller");
      }
    };

    loadUser();
  }, []);
//console.log(sellerEmail)
  // 👀 Live image preview
  const imageValue = watch("image");
  useEffect(() => {
    if (imageValue) setImagePreview(imageValue);
  }, [imageValue]);

  const onSubmit = async (data: MedicineFormData) => {
    if (!sellerEmail) return;

    const payload = {
      ...data,
      sellerEmail,
      status: "active",
    };

    try {
      const res = await fetch("http://localhost:4000/shop/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        return toast.error(result.message || "Failed to add medicine");
      }

      toast.success("Medicine added successfully");
      reset();
      setImagePreview("");
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-2">Add New Medicine</h2>
      <p className="text-sm text-gray-500 mb-6">
        Logged in as: <span className="font-medium">{sellerEmail}</span>
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <Input
          label="Medicine Name"
          error={errors.name}
          {...register("name", { required: "Name is required" })}
        />

        <Input
          label="Generic Name"
          {...register("genericName")}
        />

        <Input
          label="Brand"
          {...register("brand")}
        />

        <Input
          label="Category"
          {...register("category")}
        />

        <Input
          label="Price"
          type="number"
          step="0.01"
          error={errors.price}
          {...register("price", {
            required: "Price is required",
            valueAsNumber: true,
          })}
        />

        <Input
          label="Discount (%)"
          type="number"
          {...register("discount", { valueAsNumber: true })}
        />

        <Input
          label="Stock"
          type="number"
          error={errors.stock}
          {...register("stock", {
            required: "Stock is required",
            valueAsNumber: true,
          })}
        />

        <Input
          label="Expiry Date"
          type="date"
          {...register("expiryDate")}
        />

        <Input
          label="Image URL"
          {...register("image")}
        />

        {/* Image Preview */}
        {imagePreview && (
          <div className="md:col-span-2">
            <p className="text-sm font-medium mb-1">Image Preview</p>
            <div className="relative w-40 h-40">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="rounded-lg object-cover border"
              />
            </div>
          </div>
        )}

        {/* Description */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            rows={4}
            className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-green-500"
            {...register("description")}
          />
        </div>

        {/* Submit */}
        <div className="md:col-span-2">
          <button
            disabled={isSubmitting || !sellerEmail}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {isSubmitting ? "Adding..." : "Add Medicine"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* 🔹 Input Component */
function Input({ label, error, ...props }: any) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        {...props}
        className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-green-500"
      />
      {error && (
        <p className="text-xs text-red-500 mt-1">{error.message}</p>
      )}
    </div>
  );
}
