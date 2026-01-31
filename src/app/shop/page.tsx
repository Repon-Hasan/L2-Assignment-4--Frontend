import MedicineCard from "@/components/ProductCard";
import { currentUser } from "@/services";

async function ShopPage() {
  const res = await fetch("http://localhost:4000/shop/medicines", {
    cache: "no-store",
  });

  const products = await res.json();
  return (
    <div className="grid md:grid-cols-3 gap-8 p-6 max-w-7xl mx-auto">
      {products.data.map((product:any) => (
        <MedicineCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ShopPage;
