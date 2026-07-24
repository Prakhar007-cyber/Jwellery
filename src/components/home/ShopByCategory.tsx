"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { CATEGORY_IMAGE, img } from "@/lib/images";
import { Reveal } from "@/components/ui/Reveal";

/*
  Shop by category — large, asymmetric editorial compositions
  (not small e-commerce cards). Each tile zooms on hover and
  routes to the filtered shop page.
*/

const TILES = [
  { slug: "rings", label: "Rings", copy: "Solitaires & signets", span: "lg:col-span-7 lg:row-span-2" },
  { slug: "necklaces", label: "Necklaces", copy: "Pendants & rivières", span: "lg:col-span-5" },
  { slug: "earrings", label: "Earrings", copy: "Hoops & drops", span: "lg:col-span-5" },
  { slug: "bracelets", label: "Bracelets", copy: "Tennis & cuffs", span: "lg:col-span-7" },
];

export function ShopByCategory() {
  return (
    <section className="bg-ivory px-6 py-24 lg:px-14">
      <div className="mx-auto max-w-[1500px]">
        <Reveal className="mb-14 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <h2 className="display text-5xl lg:text-7xl">Shop by category</h2>
          <Link href="/shop" className="eyebrow border-b border-espresso pb-1">
            View all jewelry
          </Link>
        </Reveal>

        <div className="grid auto-rows-[minmax(280px,1fr)] grid-cols-1 gap-4 lg:grid-cols-12">
          {TILES.map((tile, i) => (
            <Reveal
              key={tile.slug}
              delay={i * 0.08}
              className={`group relative ${tile.span}`}
            >
              <Link
                href={`/shop?category=${tile.slug}`}
                data-cursor="view"
                className="relative block h-full min-h-[280px] overflow-hidden bg-pearl"
              >
                <Image
                  src={img(CATEGORY_IMAGE[tile.slug], 1200)}
                  alt={tile.label}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent transition-opacity duration-500 group-hover:from-ink/70" />
                <div className="absolute inset-0 flex flex-col justify-end p-8 text-ivory">
                  <div className="flex items-end justify-between">
                    <div className="transition-transform duration-500 group-hover:-translate-y-1">
                      <span className="eyebrow text-ivory/75">{tile.copy}</span>
                      <h3 className="display mt-2 text-4xl lg:text-5xl">{tile.label}</h3>
                    </div>
                    <span className="grid h-12 w-12 shrink-0 translate-y-2 place-items-center rounded-full border border-ivory/50 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <ArrowUpRight className="h-5 w-5" strokeWidth={1.2} />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
