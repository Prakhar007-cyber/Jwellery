"use client";

import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import type { Product } from "@/lib/types";

/*
  Featured products — the first e-commerce UI on the page.
  Products are fetched from MongoDB in the server component and
  passed in as props. Cards stay minimal (imagery + whitespace).
*/
export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="bg-ivory px-6 py-24 lg:px-14">
      <div className="mx-auto max-w-[1500px]">
        <Reveal className="mb-14 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="eyebrow text-gold">Selected for you</span>
            <h2 className="display mt-4 text-5xl lg:text-7xl">The edit</h2>
          </div>
          <Link href="/shop" className="eyebrow border-b border-espresso pb-1">
            Shop all pieces
          </Link>
        </Reveal>

        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
          {products.map((product, i) => (
            <Reveal key={product._id} delay={(i % 4) * 0.06}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
