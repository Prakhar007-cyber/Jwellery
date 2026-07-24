import type { Category, Collection } from "./types";

// Central place for category / collection metadata used by the
// navigation, shop filters and admin forms.

export const CATEGORIES: { slug: Category; label: string }[] = [
  { slug: "rings", label: "Rings" },
  { slug: "necklaces", label: "Necklaces" },
  { slug: "bracelets", label: "Bracelets" },
  { slug: "earrings", label: "Earrings" },
  { slug: "wedding", label: "Wedding" },
];

export const COLLECTIONS: { slug: Collection; label: string; tagline: string }[] = [
  { slug: "celeste", label: "Celeste", tagline: "Born from light." },
  { slug: "eternal", label: "Eternal", tagline: "Promises that last." },
  { slug: "solstice", label: "Solstice", tagline: "Warmth in gold." },
  { slug: "aurora", label: "Aurora", tagline: "Colour and clarity." },
];

export const MATERIALS = [
  "18K Yellow Gold",
  "18K White Gold",
  "18K Rose Gold",
  "Platinum",
  "Sterling Silver",
];

// Flat shipping — kept simple and calculated server-side.
export const SHIPPING_FLAT = 25;
export const FREE_SHIPPING_THRESHOLD = 1500;

export function money(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
