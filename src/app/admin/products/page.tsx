import Link from "next/link";
import { Plus } from "lucide-react";
import { getProducts } from "@/lib/data";
import { AdminProductsTable } from "@/components/admin/AdminProductsTable";

// Admin products list.
export default async function AdminProductsPage() {
  const products = await getProducts({ sort: "newest" });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="display text-4xl">Products</h1>
        <Link href="/admin/products/new" className="flex items-center gap-2 bg-espresso px-6 py-3">
          <Plus className="h-4 w-4 text-ivory" strokeWidth={1.5} />
          <span className="eyebrow text-ivory">New Product</span>
        </Link>
      </div>
      <AdminProductsTable products={products} />
    </div>
  );
}
