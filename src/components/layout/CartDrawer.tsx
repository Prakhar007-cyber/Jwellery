"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { money, SHIPPING_FLAT, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

/*
  Slide-in cart drawer. Opens automatically when an item is added
  (see CartProvider) and can be opened from the bag icon. Lets the
  user change quantities, remove items and proceed to checkout.
*/
export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeFromCart, getCartTotal } =
    useCart();

  const subtotal = getCartTotal();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FLAT;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={closeCart}
            className="fixed inset-0 z-[110] bg-espresso/30 backdrop-blur-sm"
          />
          {/* Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 z-[120] flex h-full w-full max-w-md flex-col bg-ivory"
            aria-label="Shopping bag"
          >
            <header className="flex items-center justify-between border-b border-line px-6 py-5">
              <span className="eyebrow">Your Jewelry Box</span>
              <button onClick={closeCart} aria-label="Close bag" className="p-1">
                <X className="h-5 w-5" strokeWidth={1.2} />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <ShoppingBag className="h-8 w-8 text-beige" strokeWidth={1} />
                <p className="display text-3xl">Your jewelry box is waiting.</p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="eyebrow mt-2 border-b border-espresso pb-1"
                >
                  Discover the collection
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  {items.map((item) => (
                    <div
                      key={item.productId + (item.size || "")}
                      className="flex gap-4 border-b border-line py-5"
                    >
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={closeCart}
                        className="relative h-24 w-20 shrink-0 overflow-hidden bg-pearl"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </Link>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between gap-2">
                          <h3 className="font-serif text-lg leading-tight">{item.name}</h3>
                          <button
                            onClick={() => removeFromCart(item.productId, item.size)}
                            aria-label={`Remove ${item.name}`}
                            className="text-espresso-soft hover:text-espresso"
                          >
                            <X className="h-4 w-4" strokeWidth={1.2} />
                          </button>
                        </div>
                        {item.size && (
                          <span className="mt-1 text-xs text-espresso-soft">
                            Size {item.size}
                          </span>
                        )}
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div className="flex items-center border border-line">
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.size, item.quantity - 1)
                              }
                              className="px-2 py-1.5"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" strokeWidth={1.5} />
                            </button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.size, item.quantity + 1)
                              }
                              className="px-2 py-1.5"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" strokeWidth={1.5} />
                            </button>
                          </div>
                          <span className="text-sm">{money(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <footer className="border-t border-line px-6 py-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-espresso-soft">Subtotal</span>
                    <span>{money(subtotal)}</span>
                  </div>
                  <div className="mt-1 flex justify-between text-sm">
                    <span className="text-espresso-soft">Shipping</span>
                    <span>{shipping === 0 ? "Complimentary" : money(shipping)}</span>
                  </div>
                  <div className="mt-3 flex justify-between border-t border-line pt-3 font-serif text-xl">
                    <span>Total</span>
                    <span>{money(subtotal + shipping)}</span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="mt-5 block w-full bg-espresso py-4 text-center text-ivory transition-colors hover:bg-ink"
                  >
                    <span className="eyebrow text-ivory">Checkout</span>
                  </Link>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
