"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { WishlistButton } from "./WishlistButton";
import { money } from "@/lib/constants";
import type { Product } from "@/lib/types";

/*
  Minimal luxury product card. Relies on imagery + whitespace,
  not borders/shadows. On hover it cross-fades to the alternate
  image and reveals a "Quick Add" action.
*/
export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const toast = useToast();
  const [hover, setHover] = useState(false);

  const hasAlt = product.images.length > 1;
  const needsSize = product.sizes && product.sizes.length > 0;

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault();
    // If the item needs a size, send the shopper to the detail page instead.
    if (needsSize) {
      window.location.href = `/product/${product.slug}`;
      return;
    }
    addToCart({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: product.price,
      quantity: 1,
    });
    toast("Added to your jewelry box.");
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      data-cursor="view"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-pearl">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className={`object-cover transition-opacity duration-700 ${
            hover && hasAlt ? "opacity-0" : "opacity-100"
          }`}
        />
        {hasAlt && (
          <Image
            src={product.images[1]}
            alt=""
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            aria-hidden
            className={`object-cover transition-transform duration-[1200ms] ease-out ${
              hover ? "scale-105 opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* Wishlist heart */}
        <div className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-ivory/80 opacity-0 backdrop-blur transition-opacity duration-500 group-hover:opacity-100">
          <WishlistButton product={product} />
        </div>

        {/* Quick add */}
        <button
          onClick={quickAdd}
          className="absolute inset-x-3 bottom-3 z-10 translate-y-3 bg-ivory/95 py-3 text-center opacity-0 backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <span className="eyebrow">{needsSize ? "View Details" : "Quick Add"}</span>
        </button>

        {product.compareAtPrice && (
          <span className="eyebrow absolute left-3 top-3 bg-espresso px-2 py-1 text-[0.6rem] text-ivory">
            Sale
          </span>
        )}
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-lg leading-snug">{product.name}</h3>
          <p className="mt-0.5 text-xs capitalize text-espresso-soft">{product.category}</p>
        </div>
        <div className="text-right">
          <p className="text-sm">{money(product.price)}</p>
          {product.compareAtPrice && (
            <p className="text-xs text-espresso-soft line-through">
              {money(product.compareAtPrice)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
