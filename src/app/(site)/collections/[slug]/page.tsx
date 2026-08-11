import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProducts } from "@/lib/data";
import { COLLECTIONS } from "@/lib/constants";
import { ProductCard } from "@/components/product/ProductCard";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = COLLECTIONS.find((x) => x.slug === slug);
  return { title: c ? `${c.label} Collection — ÉLANORA` : "ÉLANORA" };
}

// Collection detail — filtered products for a single collection.
export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = COLLECTIONS.find((c) => c.slug === slug);
  if (!collection) notFound();

  const products = await getProducts({ collection: slug });

  return (
    <div className="px-6 pb-24 pt-32 lg:px-14">
      <div className="mx-auto max-w-375">
        <header className="mb-14 border-b border-line pb-12 text-center">
          <span className="eyebrow text-gold">The {collection.label} Collection</span>
          <h1 className="display mt-4 text-6xl lg:text-8xl">{collection.tagline}</h1>
        </header>

        {products.length === 0 ? (
          <p className="text-center text-espresso-soft">Pieces from this collection are coming soon.</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 lg:gap-x-6">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
