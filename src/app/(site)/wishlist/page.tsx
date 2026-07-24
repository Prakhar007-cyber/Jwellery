"use client";

import Link from "next/link";
import { useWishlist } from "@/components/providers/WishlistProvider";
import { ProductCard } from "@/components/product/ProductCard";

// Wishlist page — reads saved pieces from the wishlist context.
export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <div className="px-6 pb-24 pt-32 lg:px-14">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-14 border-b border-line pb-10 text-center">
          <span className="eyebrow text-gold">Saved Pieces</span>
          <h1 className="display mt-4 text-6xl lg:text-8xl">Your Wishlist</h1>
        </header>

        {items.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
            <p className="display text-4xl">Pieces you love will appear here.</p>
            <Link href="/shop" className="eyebrow mt-6 border-b border-espresso pb-1">
              Explore the collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {items.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
