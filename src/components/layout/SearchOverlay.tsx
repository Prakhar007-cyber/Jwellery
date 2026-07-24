"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { X, Search } from "lucide-react";
import { money } from "@/lib/constants";
import type { Product } from "@/lib/types";

/*
  Full-screen search overlay. Queries /api/search (which searches
  MongoDB) with a short debounce and shows live results.
*/
const POPULAR = ["Diamond Ring", "Gold Hoops", "Pearl Necklace", "Bridal", "Celeste"];

export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Debounced search against the API.
  useEffect(() => {
    if (!term.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      return;
    }
    setLoading(true);
    const id = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
      const data = await res.json();
      setResults(data.products || []);
      setLoading(false);
    }, 300);
    return () => clearTimeout(id);
  }, [term]);

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[150] bg-ivory/98 backdrop-blur-xl"
        >
          <div className="mx-auto flex h-full max-w-4xl flex-col px-6 pt-8">
            <div className="flex items-center justify-between">
              <span className="eyebrow text-gold">ÉLANORA — Search</span>
              <button onClick={onClose} aria-label="Close search" className="p-2">
                <X className="h-6 w-6" strokeWidth={1} />
              </button>
            </div>

            <div className="mt-12 flex items-center gap-4 border-b border-espresso pb-4">
              <Search className="h-6 w-6 text-espresso-soft" strokeWidth={1} />
              <input
                autoFocus
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search rings, necklaces, collections…"
                className="w-full bg-transparent font-serif text-3xl outline-none placeholder:text-beige md:text-5xl"
              />
            </div>

            {!term && (
              <div className="mt-8">
                <span className="eyebrow text-espresso-soft">Popular searches</span>
                <div className="mt-4 flex flex-wrap gap-3">
                  {POPULAR.map((p) => (
                    <button
                      key={p}
                      onClick={() => setTerm(p)}
                      className="border border-line px-4 py-2 text-sm transition-colors hover:border-espresso"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex-1 overflow-y-auto pb-8">
              {loading && <p className="eyebrow text-espresso-soft">Searching…</p>}
              {!loading && term && results.length === 0 && (
                <p className="font-serif text-2xl text-espresso-soft">
                  No pieces found for “{term}”.
                </p>
              )}
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                {results.map((p) => (
                  <Link
                    key={p._id}
                    href={`/product/${p.slug}`}
                    onClick={onClose}
                    className="group block"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-pearl">
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        sizes="25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <h4 className="mt-2 font-serif text-base leading-tight">{p.name}</h4>
                    <p className="text-xs text-espresso-soft">{money(p.price)}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
