"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { useWishlist } from "@/components/providers/WishlistProvider";
import { SearchOverlay } from "./SearchOverlay";
import { CATEGORIES } from "@/lib/constants";
import { IMAGES, img } from "@/lib/images";
import Image from "next/image";

/*
  ÉLANORA navigation.
  ------------------------------------------------------------
  - Transparent + light text while over the dark hero (home only).
  - Turns into a solid ivory glass bar once the user scrolls.
  - Hovering "Jewelry" opens an animated mega menu.
  - The bag icon animates whenever an item is added (cart.bump).
*/

const NAV_LINKS = [
  { label: "New", href: "/shop?sort=newest" },
  { label: "Jewelry", href: "/shop", mega: true },
  { label: "Rings", href: "/shop?category=rings" },
  { label: "Necklaces", href: "/shop?category=necklaces" },
  { label: "Collections", href: "/collections" },
];

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const { openCart, getCartCount, bump } = useCart();
  const { items: wishItems } = useWishlist();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Light text only when over the hero (home, not yet scrolled).
  const overHero = isHome && !scrolled && !megaOpen;
  const solid = !overHero;

  const textColor = overHero ? "text-ivory" : "text-espresso";

  return (
    <>
      <header
        onMouseLeave={() => setMegaOpen(false)}
        className={`fixed inset-x-0 top-0 z-[100] transition-all duration-500 ${
          solid ? "bg-ivory/85 backdrop-blur-md border-b border-line" : "bg-transparent"
        }`}
      >
        <nav className={`mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4 lg:px-10 ${textColor}`}>
          {/* Left: primary links (desktop) */}
          <div className="hidden flex-1 items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => (
              <div
                key={link.label}
                onMouseEnter={() => setMegaOpen(Boolean(link.mega))}
              >
                <Link
                  href={link.href}
                  className="eyebrow transition-opacity hover:opacity-60"
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden"
            aria-label="Open menu"
          >
            <Menu strokeWidth={1.2} className="h-6 w-6" />
          </button>

          {/* Center: wordmark */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 font-serif text-2xl tracking-[0.25em] lg:text-3xl"
            aria-label="ÉLANORA home"
          >
            ÉLANORA
          </Link>

          {/* Right: utility icons */}
          <div className="flex flex-1 items-center justify-end gap-4 lg:gap-5">
            <button onClick={() => setSearchOpen(true)} aria-label="Search" className="hover:opacity-60">
              <Search strokeWidth={1.2} className="h-5 w-5" />
            </button>
            <Link href="/account" aria-label="Account" className="hidden hover:opacity-60 sm:block">
              <User strokeWidth={1.2} className="h-5 w-5" />
            </Link>
            <Link href="/wishlist" aria-label="Wishlist" className="relative hover:opacity-60">
              <Heart strokeWidth={1.2} className="h-5 w-5" />
              {wishItems.length > 0 && (
                <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-gold text-[0.55rem] text-ivory">
                  {wishItems.length}
                </span>
              )}
            </Link>
            <button onClick={openCart} aria-label="Shopping bag" className="relative hover:opacity-60">
              <motion.span
                key={bump}
                initial={bump ? { scale: 0.6, rotate: -8 } : false}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                className="block"
              >
                <ShoppingBag strokeWidth={1.2} className="h-5 w-5" />
              </motion.span>
              {getCartCount() > 0 && (
                <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-gold text-[0.55rem] text-ivory">
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>
        </nav>

        {/* Mega menu */}
        <AnimatePresence>
          {megaOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-0 top-full hidden bg-ivory/95 backdrop-blur-md lg:block"
              onMouseEnter={() => setMegaOpen(true)}
            >
              <div className="mx-auto grid max-w-[1600px] grid-cols-[1fr_1.6fr] gap-10 px-10 py-10">
                <div>
                  <span className="eyebrow text-gold">Shop by Category</span>
                  <ul className="mt-6 space-y-3">
                    {CATEGORIES.map((c) => (
                      <li key={c.slug}>
                        <Link
                          href={`/shop?category=${c.slug}`}
                          onClick={() => setMegaOpen(false)}
                          className="font-serif text-3xl text-espresso transition-colors hover:text-gold"
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { img: IMAGES.ringDiamondDark, label: "The Celeste Collection", href: "/collections/celeste" },
                    { img: IMAGES.necklaceGoldSet, label: "Bridal & Wedding", href: "/shop?category=wedding" },
                  ].map((tile) => (
                    <Link
                      key={tile.label}
                      href={tile.href}
                      onClick={() => setMegaOpen(false)}
                      className="group relative aspect-[4/3] overflow-hidden bg-pearl"
                    >
                      <Image
                        src={img(tile.img, 700)}
                        alt={tile.label}
                        fill
                        sizes="30vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-espresso/20" />
                      <span className="eyebrow absolute bottom-4 left-4 text-ivory">
                        {tile.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[130] bg-ivory lg:hidden"
          >
            <div className="flex items-center justify-between px-6 py-4">
              <span className="font-serif text-2xl tracking-[0.25em]">ÉLANORA</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X strokeWidth={1.2} className="h-6 w-6" />
              </button>
            </div>
            <div className="flex flex-col gap-1 px-6 pt-8">
              {[...NAV_LINKS, { label: "Wishlist", href: "/wishlist" }, { label: "Account", href: "/account" }].map(
                (link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i + 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block border-b border-line py-4 font-serif text-3xl"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
