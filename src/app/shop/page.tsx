// app/shop/page.tsx
"use client";

import { useEffect, useState } from "react";
import MedicineCard from "@/components/ProductCard";

type Product = {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
};

function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");

  // fetch data
  useEffect(() => {
    fetch("http://localhost:4000/shop/medicines", { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        setProducts(data.data);
        setFilteredProducts(data.data);
      });
  }, []);

  // filter logic
  useEffect(() => {
    let result = [...products];

    if (search) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      result = result.filter(p => p.category === category);
    }

    if (brand) {
      result = result.filter(p => p.brand === brand);
    }

    if (maxPrice !== "") {
      result = result.filter(p => p.price <= maxPrice);
    }

    setFilteredProducts(result);
  }, [search, category, brand, maxPrice, products]);

  // unique values for dropdowns
  const categories = [...new Set(products.map(p => p.category))];
  const brands = [...new Set(products.map(p => p.brand))];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* 🔍 Filters */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <input
          type="text"
          placeholder="Search medicine..."
          className="border rounded-lg px-4 py-2"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          className="border rounded-lg px-4 py-2"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          className="border rounded-lg px-4 py-2"
          value={brand}
          onChange={e => setBrand(e.target.value)}
        >
          <option value="">All Manufacturers</option>
          {brands.map(br => (
            <option key={br} value={br}>
              {br}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Max price"
          className="border rounded-lg px-4 py-2"
          value={maxPrice}
          onChange={e =>
            setMaxPrice(e.target.value ? Number(e.target.value) : "")
          }
        />
      </div>

      {/* 🧾 Products */}
      <div className="grid md:grid-cols-3 gap-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <MedicineCard key={product.id} product={product} />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No medicines found
          </p>
        )}
      </div>
    </div>
  );
}

export default ShopPage;
