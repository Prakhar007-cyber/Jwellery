"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { CartItem } from "@/lib/types";

/*
  Cart state.
  ------------------------------------------------------------
  A simple React Context (no Redux/Zustand needed). The cart is
  persisted to localStorage so it survives page reloads. Prices
  shown here are only for display — the real total is recomputed
  on the server at checkout from the database.
*/

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  bump: number; // increments each add — the bag icon animates on change
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, size: string | undefined, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

const STORAGE_KEY = "elanora_cart";

// Two lines refer to the same item only if product AND size match.
const sameItem = (a: CartItem, id: string, size?: string) =>
  a.productId === id && (a.size || "") === (size || "");

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [bump, setBump] = useState(0);

  // Load once on mount. We intentionally hydrate from localStorage
  // AFTER mount (not in a useState initializer) so the server and the
  // first client render match — avoiding a hydration mismatch.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setItems(JSON.parse(saved));
    } catch {
      /* ignore malformed storage */
    }
  }, []);

  // Persist whenever the cart changes.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((p) => sameItem(p, item.productId, item.size));
      if (existing) {
        return prev.map((p) =>
          sameItem(p, item.productId, item.size)
            ? { ...p, quantity: p.quantity + item.quantity }
            : p
        );
      }
      return [...prev, item];
    });
    setBump((b) => b + 1);
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((productId: string, size?: string) => {
    setItems((prev) => prev.filter((p) => !sameItem(p, productId, size)));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, size: string | undefined, quantity: number) => {
      setItems((prev) =>
        prev
          .map((p) =>
            sameItem(p, productId, size) ? { ...p, quantity } : p
          )
          .filter((p) => p.quantity > 0)
      );
    },
    []
  );

  const clearCart = useCallback(() => setItems([]), []);

  const getCartTotal = useCallback(
    () => items.reduce((sum, p) => sum + p.price * p.quantity, 0),
    [items]
  );

  const getCartCount = useCallback(
    () => items.reduce((sum, p) => sum + p.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        bump,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
