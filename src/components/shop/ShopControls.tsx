"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal, X, Check } from "lucide-react";
import { CATEGORIES, COLLECTIONS, MATERIALS } from "@/lib/constants";

/*
  Shop filters + sorting. Reads and writes the URL query string so
  filters are shareable and bookmarkable. Desktop shows a sidebar;
  mobile shows a slide-in drawer with the same controls.
*/

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

function useFilters() {
  const router = useRouter();
  const params = useSearchParams();

  // Set or clear a single query param, then navigate.
  function setParam(key: string, value?: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/shop?${next.toString()}`);
  }

  return { params, setParam };
}

function FilterGroup({
  title,
  options,
  paramKey,
}: {
  title: string;
  options: { value: string; label: string }[];
  paramKey: string;
}) {
  const { params, setParam } = useFilters();
  const active = params.get(paramKey);
  return (
    <div className="border-b border-line py-6">
      <span className="eyebrow text-espresso-soft">{title}</span>
      <ul className="mt-4 space-y-2.5">
        {options.map((o) => {
          const on = active === o.value;
          return (
            <li key={o.value}>
              <button
                onClick={() => setParam(paramKey, on ? undefined : o.value)}
                className={`flex w-full items-center justify-between text-left text-sm transition-colors hover:text-espresso ${
                  on ? "text-espresso" : "text-espresso-soft"
                }`}
              >
                {o.label}
                {on && <Check className="h-3.5 w-3.5 text-gold" strokeWidth={2} />}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function FilterBody() {
  const { params, setParam } = useFilters();
  return (
    <div>
      <FilterGroup title="Category" paramKey="category" options={CATEGORIES.map((c) => ({ value: c.slug, label: c.label }))} />
      <FilterGroup title="Collection" paramKey="collection" options={COLLECTIONS.map((c) => ({ value: c.slug, label: c.label }))} />
      <FilterGroup title="Material" paramKey="material" options={MATERIALS.map((m) => ({ value: m, label: m }))} />
      <div className="py-6">
        <label className="flex items-center gap-2 text-sm text-espresso-soft">
          <input
            type="checkbox"
            checked={params.get("inStock") === "1"}
            onChange={(e) => setParam("inStock", e.target.checked ? "1" : undefined)}
            className="accent-gold"
          />
          In stock only
        </label>
      </div>
    </div>
  );
}

export function ShopSidebar() {
  return (
    <aside className="hidden w-56 shrink-0 lg:block">
      <FilterBody />
    </aside>
  );
}

export function ShopTopBar({ count }: { count: number }) {
  const { params, setParam } = useFilters();
  const [drawer, setDrawer] = useState(false);
  const sort = params.get("sort") || "featured";

  return (
    <div className="mb-8 flex items-center justify-between border-b border-line pb-5">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setDrawer(true)}
          className="flex items-center gap-2 lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" strokeWidth={1.4} />
          <span className="eyebrow">Filters</span>
        </button>
        <span className="text-sm text-espresso-soft">{count} pieces</span>
      </div>

      <label className="flex items-center gap-2">
        <span className="eyebrow hidden text-espresso-soft sm:inline">Sort</span>
        <select
          value={sort}
          onChange={(e) => setParam("sort", e.target.value)}
          className="border-b border-espresso/30 bg-transparent py-1 text-sm outline-none"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>

      {/* Mobile filter drawer */}
      {drawer && (
        <div className="fixed inset-0 z-[140] lg:hidden">
          <div className="absolute inset-0 bg-espresso/30" onClick={() => setDrawer(false)} />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85%] overflow-y-auto bg-ivory px-6 py-5">
            <div className="flex items-center justify-between">
              <span className="eyebrow">Filters</span>
              <button onClick={() => setDrawer(false)} aria-label="Close filters">
                <X className="h-5 w-5" strokeWidth={1.2} />
              </button>
            </div>
            <FilterBody />
          </div>
        </div>
      )}
    </div>
  );
}
