"use client";

import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "./ToastProvider";
import { WishlistProvider } from "./WishlistProvider";
import { CartProvider } from "./CartProvider";
import { CartDrawer } from "@/components/layout/CartDrawer";

/*
  Composes all global client providers in one place, plus the
  cart drawer (which needs cart state and can open on any page).
  Order: session → toasts → wishlist → cart.
*/
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <WishlistProvider>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </WishlistProvider>
      </ToastProvider>
    </SessionProvider>
  );
}
