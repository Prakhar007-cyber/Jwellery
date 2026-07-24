"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2, Pencil } from "lucide-react";
import { useToast } from "@/components/providers/ToastProvider";
import { money } from "@/lib/constants";
import type { Product } from "@/lib/types";

// Admin product list with edit + delete actions.
export function AdminProductsTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const toast = useToast();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function remove(id: string, name: string) {
    if (!confirm(`Delete “${name}”? This cannot be undone.`)) return;
    setDeleting(id);
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setDeleting(null);
    if (res.ok) {
      toast("Product deleted.");
      router.refresh();
    } else {
      toast("Could not delete product.");
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-line text-left">
            <th className="pb-3 font-normal"><span className="eyebrow text-espresso-soft">Product</span></th>
            <th className="pb-3 font-normal"><span className="eyebrow text-espresso-soft">Category</span></th>
            <th className="pb-3 font-normal"><span className="eyebrow text-espresso-soft">Price</span></th>
            <th className="pb-3 font-normal"><span className="eyebrow text-espresso-soft">Stock</span></th>
            <th className="pb-3 font-normal"><span className="eyebrow text-espresso-soft">Featured</span></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-b border-line">
              <td className="py-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-10 shrink-0 overflow-hidden bg-pearl">
                    {p.images[0] && <Image src={p.images[0]} alt="" fill sizes="40px" className="object-cover" />}
                  </div>
                  <span className="font-serif">{p.name}</span>
                </div>
              </td>
              <td className="py-3 capitalize text-espresso-soft">{p.category}</td>
              <td className="py-3">{money(p.price)}</td>
              <td className="py-3">{p.stock}</td>
              <td className="py-3">{p.featured ? "★" : "—"}</td>
              <td className="py-3">
                <div className="flex items-center justify-end gap-3">
                  <Link href={`/admin/products/${p._id}`} aria-label="Edit" className="text-espresso-soft hover:text-espresso">
                    <Pencil className="h-4 w-4" strokeWidth={1.4} />
                  </Link>
                  <button
                    onClick={() => remove(p._id, p.name)}
                    disabled={deleting === p._id}
                    aria-label="Delete"
                    className="text-espresso-soft hover:text-red-700 disabled:opacity-40"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.4} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
