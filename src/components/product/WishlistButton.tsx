"use client";

import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { useWishlist } from "@/components/providers/WishlistProvider";
import { useToast } from "@/components/providers/ToastProvider";
import type { Product } from "@/lib/types";

// A small, elegant heart toggle. Fills when the product is saved.
export function WishlistButton({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const { has, toggle } = useWishlist();
  const toast = useToast();
  const saved = has(product._id);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        toggle(product);
        toast(saved ? "Removed from your wishlist." : "Saved to your wishlist.");
      }}
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={saved}
      className={`grid place-items-center ${className}`}
    >
      <motion.span whileTap={{ scale: 0.8 }} className="grid place-items-center">
        <Heart
          className={saved ? "fill-gold text-gold" : "text-espresso"}
          style={{ width: 18, height: 18 }}
          strokeWidth={1.3}
        />
      </motion.span>
    </button>
  );
}
