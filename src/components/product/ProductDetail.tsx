"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, ChevronDown, Check } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { WishlistButton } from "./WishlistButton";
import { money } from "@/lib/constants";
import type { Product } from "@/lib/types";

/*
  Product detail — luxury PDP.
  Left: image gallery (imagery dominates). Right: sticky product
  info with size, quantity, add-to-bag, wishlist and detail tabs.
*/
export function ProductDetail({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const toast = useToast();

  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState<string | undefined>(product.sizes?.[0]);
  const [qty, setQty] = useState(1);
  const [openTab, setOpenTab] = useState<string | null>("Details");

  const needsSize = product.sizes && product.sizes.length > 0;
  const outOfStock = product.stock <= 0;

  function handleAdd() {
    addToCart({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: product.price,
      size,
      quantity: qty,
    });
    toast("Added to your jewelry box.");
  }

  const tabs = [
    { title: "Details", body: product.description },
    { title: "Materials", body: `Crafted in ${product.material}${product.stone && product.stone !== "None" ? ` and set with ${product.stone}.` : "."} Each piece is hand-finished in the ÉLANORA atelier.` },
    { title: "Shipping", body: "Complimentary insured shipping on orders over $1,500. Every order arrives in signature ÉLANORA packaging within 3–5 business days." },
    { title: "Care Guide", body: "Store your piece in the pouch provided. Avoid contact with perfume and moisture, and polish gently with a soft cloth to maintain its shine." },
  ];

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      {/* Gallery */}
      <div className="flex flex-col gap-4">
        <div className="group relative aspect-[4/5] overflow-hidden bg-pearl" data-cursor="view">
          <Image
            src={product.images[activeImage]}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-3">
            {product.images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`relative aspect-square w-20 overflow-hidden bg-pearl transition-opacity ${
                  activeImage === i ? "ring-1 ring-espresso" : "opacity-70 hover:opacity-100"
                }`}
                aria-label={`View image ${i + 1}`}
              >
                <Image src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="lg:sticky lg:top-28 lg:h-fit">
        <span className="eyebrow capitalize text-gold">{product.category} · {product.collection}</span>
        <h1 className="display mt-3 text-5xl lg:text-6xl">{product.name}</h1>

        <div className="mt-5 flex items-center gap-3">
          <span className="text-2xl">{money(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-espresso-soft line-through">{money(product.compareAtPrice)}</span>
          )}
        </div>

        <p className="mt-6 max-w-md text-espresso-soft">{product.shortDescription || product.description}</p>

        {/* Material / stone chips */}
        <div className="mt-6 flex flex-wrap gap-2">
          {product.material && (
            <span className="border border-line px-3 py-1.5 text-xs">{product.material}</span>
          )}
          {product.stone && product.stone !== "None" && (
            <span className="border border-line px-3 py-1.5 text-xs">{product.stone}</span>
          )}
        </div>

        {/* Size selector */}
        {needsSize && (
          <div className="mt-8">
            <span className="eyebrow text-espresso-soft">Size</span>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`h-11 w-11 border text-sm transition-colors ${
                    size === s ? "border-espresso bg-espresso text-ivory" : "border-line hover:border-espresso"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity + stock */}
        <div className="mt-8 flex items-center gap-6">
          <div className="flex items-center border border-line">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-3" aria-label="Decrease quantity">
              <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
            <span className="w-10 text-center text-sm">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} className="px-3 py-3" aria-label="Increase quantity">
              <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          </div>
          <span className="text-xs text-espresso-soft">
            {outOfStock ? "Currently unavailable" : `${product.stock} in stock`}
          </span>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleAdd}
            disabled={outOfStock}
            className="flex-1 bg-espresso py-4 text-ivory transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="eyebrow text-ivory">{outOfStock ? "Sold Out" : "Add to Bag"}</span>
          </button>
          <div className="grid w-14 place-items-center border border-line">
            <WishlistButton product={product} />
          </div>
        </div>

        {/* Detail tabs */}
        <div className="mt-10 border-t border-line">
          {tabs.map((tab) => (
            <div key={tab.title} className="border-b border-line">
              <button
                onClick={() => setOpenTab(openTab === tab.title ? null : tab.title)}
                className="flex w-full items-center justify-between py-4 text-left"
              >
                <span className="eyebrow">{tab.title}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${openTab === tab.title ? "rotate-180" : ""}`}
                  strokeWidth={1.4}
                />
              </button>
              {openTab === tab.title && (
                <p className="pb-5 text-sm leading-relaxed text-espresso-soft">{tab.body}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs text-espresso-soft">
          <Check className="h-3.5 w-3.5 text-gold" strokeWidth={1.5} />
          Responsibly sourced · Hallmarked · Lifetime care
        </div>
      </div>
    </div>
  );
}
