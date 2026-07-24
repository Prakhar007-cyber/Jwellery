"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/providers/ToastProvider";
import { CATEGORIES, COLLECTIONS } from "@/lib/constants";
import type { Product, Category, Collection } from "@/lib/types";

/*
  Shared product form for creating and editing products. Posts to
  the admin API (which re-validates and checks admin authorization
  server-side). Images and sizes are entered as simple text lists.
*/
export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const toast = useToast();
  const isEdit = Boolean(product);

  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    shortDescription: product?.shortDescription || "",
    price: product?.price?.toString() || "",
    compareAtPrice: product?.compareAtPrice?.toString() || "",
    category: product?.category || "rings",
    collection: product?.collection || "celeste",
    material: product?.material || "",
    stone: product?.stone || "",
    sizes: (product?.sizes || []).join(", "),
    stock: product?.stock?.toString() || "0",
    images: (product?.images || []).join("\n"),
    featured: product?.featured || false,
    newArrival: product?.newArrival || false,
    bestSeller: product?.bestSeller || false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm({ ...form, [key]: value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    // Build the payload with the correct types for the API.
    const payload = {
      name: form.name,
      description: form.description,
      shortDescription: form.shortDescription,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
      category: form.category,
      collection: form.collection,
      material: form.material,
      stone: form.stone,
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      stock: Number(form.stock),
      images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
      featured: form.featured,
      newArrival: form.newArrival,
      bestSeller: form.bestSeller,
    };

    const res = await fetch(
      isEdit ? `/api/admin/products/${product!._id}` : "/api/admin/products",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return setError(data.error || "Could not save product.");
    }
    toast(isEdit ? "Product updated." : "Product created.");
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <Text label="Name" value={form.name} onChange={(v) => update("name", v)} required />
      <Area label="Description" value={form.description} onChange={(v) => update("description", v)} required />
      <Text label="Short description" value={form.shortDescription} onChange={(v) => update("shortDescription", v)} />

      <div className="grid grid-cols-2 gap-4">
        <Text label="Price (USD)" type="number" value={form.price} onChange={(v) => update("price", v)} required />
        <Text label="Compare-at price (optional)" type="number" value={form.compareAtPrice} onChange={(v) => update("compareAtPrice", v)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select label="Category" value={form.category} onChange={(v) => update("category", v as Category)} options={CATEGORIES.map((c) => ({ value: c.slug, label: c.label }))} />
        <Select label="Collection" value={form.collection} onChange={(v) => update("collection", v as Collection)} options={COLLECTIONS.map((c) => ({ value: c.slug, label: c.label }))} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Text label="Material" value={form.material} onChange={(v) => update("material", v)} />
        <Text label="Stone" value={form.stone} onChange={(v) => update("stone", v)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Text label="Sizes (comma separated)" value={form.sizes} onChange={(v) => update("sizes", v)} />
        <Text label="Stock" type="number" value={form.stock} onChange={(v) => update("stock", v)} />
      </div>

      <Area
        label="Image URLs (one per line — Unsplash URLs work)"
        value={form.images}
        onChange={(v) => update("images", v)}
      />

      <div className="flex flex-wrap gap-6">
        <Check label="Featured" checked={form.featured} onChange={(v) => update("featured", v)} />
        <Check label="New arrival" checked={form.newArrival} onChange={(v) => update("newArrival", v)} />
        <Check label="Best seller" checked={form.bestSeller} onChange={(v) => update("bestSeller", v)} />
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="bg-espresso px-8 py-4 disabled:opacity-60">
          <span className="eyebrow text-ivory">{saving ? "Saving…" : isEdit ? "Update Product" : "Create Product"}</span>
        </button>
        <button type="button" onClick={() => router.back()} className="border border-espresso/30 px-8 py-4">
          <span className="eyebrow">Cancel</span>
        </button>
      </div>
    </form>
  );
}

function Text({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="eyebrow mb-2 block text-[0.62rem] text-espresso-soft">{label}</span>
      <input type={type} value={value} required={required} onChange={(e) => onChange(e.target.value)} className="w-full border border-line bg-transparent px-3 py-2.5 text-sm outline-none focus:border-espresso" />
    </label>
  );
}

function Area({ label, value, onChange, required }: { label: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <label className="block">
      <span className="eyebrow mb-2 block text-[0.62rem] text-espresso-soft">{label}</span>
      <textarea value={value} required={required} onChange={(e) => onChange(e.target.value)} rows={4} className="w-full border border-line bg-transparent px-3 py-2.5 text-sm outline-none focus:border-espresso" />
    </label>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <label className="block">
      <span className="eyebrow mb-2 block text-[0.62rem] text-espresso-soft">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-line bg-transparent px-3 py-2.5 text-sm outline-none focus:border-espresso">
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="accent-gold" />
      {label}
    </label>
  );
}
