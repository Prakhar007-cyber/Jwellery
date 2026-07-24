"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useSession } from "next-auth/react";
import type { Product } from "@/lib/types";

/*
  Wishlist state.
  ------------------------------------------------------------
  Stores the full product objects so the wishlist page can render
  instantly. Persists to localStorage for everyone; for signed-in
  users it also syncs to MongoDB (via /api/wishlist) so the list
  follows them across devices.
*/

interface WishlistContextValue {
  items: Product[];
  has: (productId: string) => boolean;
  toggle: (product: Product) => void;
  remove: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}

const STORAGE_KEY = "elanora_wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [items, setItems] = useState<Product[]>([]);

  // Load from localStorage on mount (after render, to avoid a
  // hydration mismatch between server and client).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setItems(JSON.parse(saved));
    } catch {
      /* ignore */
    }
  }, []);

  // When authenticated, load the server wishlist and merge it in.
  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/wishlist")
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((data: { items: Product[] }) => {
        if (data.items?.length) {
          setItems((local) => {
            const map = new Map(local.map((p) => [p._id, p]));
            data.items.forEach((p) => map.set(p._id, p));
            return Array.from(map.values());
          });
        }
      })
      .catch(() => {});
  }, [status]);

  // Persist to localStorage whenever it changes.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const has = useCallback(
    (productId: string) => items.some((p) => p._id === productId),
    [items]
  );

  const toggle = useCallback(
    (product: Product) => {
      setItems((prev) => {
        const exists = prev.some((p) => p._id === product._id);
        // Sync to server (best-effort) only when signed in.
        if (status === "authenticated") {
          fetch("/api/wishlist", {
            method: exists ? "DELETE" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: product._id }),
          }).catch(() => {});
        }
        return exists
          ? prev.filter((p) => p._id !== product._id)
          : [...prev, product];
      });
    },
    [status]
  );

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((p) => p._id !== productId));
  }, []);

  return (
    <WishlistContext.Provider value={{ items, has, toggle, remove }}>
      {children}
    </WishlistContext.Provider>
  );
}
