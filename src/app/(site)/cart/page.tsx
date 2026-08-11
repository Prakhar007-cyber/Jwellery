"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { money, SHIPPING_FLAT, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

// Full cart page (the drawer's larger sibling). Review, edit, checkout.
export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const subtotal = getCartTotal();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FLAT;

  return (
    <div className="px-6 pb-24 pt-32 lg:px-14">
      <div className="mx-auto max-w-300">
        <header className="mb-12 border-b border-line pb-8 text-center">
          <span className="eyebrow text-gold">ÉLANORA</span>
          <h1 className="display mt-3 text-6xl lg:text-7xl">Your Bag</h1>
        </header>

        {items.length === 0 ? (
          <div className="flex min-h-[35vh] flex-col items-center justify-center text-center">
            <p className="display text-4xl">Your jewelry box is waiting.</p>
            <Link href="/shop" className="eyebrow mt-6 border-b border-espresso pb-1">
              Discover the collection
            </Link>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
            {/* Lines */}
            <div>
              {items.map((item) => (
                <div key={item.productId + (item.size || "")} className="flex gap-5 border-b border-line py-6">
                  <Link href={`/product/${item.slug}`} className="relative h-32 w-28 shrink-0 overflow-hidden bg-pearl">
                    <Image src={item.image} alt={item.name} fill sizes="112px" className="object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between">
                      <h3 className="font-serif text-xl">{item.name}</h3>
                      <button onClick={() => removeFromCart(item.productId, item.size)} aria-label="Remove">
                        <X className="h-4 w-4" strokeWidth={1.2} />
                      </button>
                    </div>
                    {item.size && <span className="mt-1 text-sm text-espresso-soft">Size {item.size}</span>}
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border border-line">
                        <button onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)} className="px-3 py-2" aria-label="Decrease">
                          <Minus className="h-3 w-3" strokeWidth={1.5} />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)} className="px-3 py-2" aria-label="Increase">
                          <Plus className="h-3 w-3" strokeWidth={1.5} />
                        </button>
                      </div>
                      <span>{money(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="h-fit border border-line p-8 lg:sticky lg:top-28">
              <h2 className="font-serif text-2xl">Order Summary</h2>
              <div className="mt-6 space-y-3 border-b border-line pb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-espresso-soft">Subtotal</span>
                  <span>{money(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-espresso-soft">Shipping</span>
                  <span>{shipping === 0 ? "Complimentary" : money(shipping)}</span>
                </div>
              </div>
              <div className="mt-6 flex justify-between font-serif text-2xl">
                <span>Total</span>
                <span>{money(subtotal + shipping)}</span>
              </div>
              <Link href="/checkout" className="mt-8 block w-full bg-espresso py-4 text-center transition-colors hover:bg-ink">
                <span className="eyebrow text-ivory">Proceed to Checkout</span>
              </Link>
              <Link href="/shop" className="mt-4 block text-center text-sm text-espresso-soft hover:text-espresso">
                Continue shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
