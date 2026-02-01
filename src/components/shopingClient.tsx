"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";

export default function ShopClient({ products }: { products: any[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [manufacturer, setManufacturer] = useState("all");
  const [price, setPrice] = useState(500);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      return (
        item.name.toLowerCase().includes(search.toLowerCase()) &&
        (category === "all" || item.category === category) &&
        (manufacturer === "all" || item.manufacturer === manufacturer) &&
        item.price <= price
      );
    });
  }, [products, search, category, manufacturer, price]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* FILTER BAR */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4
                   bg-white dark:bg-zinc-900 p-4 rounded-xl shadow mb-8"
      >
        <input
          className="input"
          placeholder="Search medicine..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select className="input" onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="Medicine">Medicine</option>
          <option value="Supplement">Supplement</option>
        </select>

        <select
          className="input"
          onChange={(e) => setManufacturer(e.target.value)}
        >
          <option value="all">All Manufacturers</option>
          <option value="Beximco">Beximco</option>
          <option value="Square">Square</option>
          <option value="ACI">ACI</option>
        </select>

        <div>
          <label className="text-sm">Max Price: ৳{price}</label>
          <input
            type="range"
            min={10}
            max={500}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </motion.div>

      {/* PRODUCT GRID */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="text-center mt-10 text-gray-500">
          No medicines found 😔
        </p>
      )}
    </div>
  );
}
