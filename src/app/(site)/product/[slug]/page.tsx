import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/ui/Reveal";

/*
  Product detail page (Server Component). Fetches the product and a
  few related pieces from MongoDB, then renders the PDP.
*/

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product ? `${product.name} — ÉLANORA` : "ÉLANORA" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.category, product.slug, 4);

  return (
    <div className="px-6 pb-24 pt-32 lg:px-14">
      <div className="mx-auto max-w-[1400px]">
        <ProductDetail product={product} />

        {related.length > 0 && (
          <section className="mt-32">
            <Reveal className="mb-12 text-center">
              <span className="eyebrow text-gold">Curated for you</span>
              <h2 className="display mt-3 text-4xl lg:text-6xl">You may also love</h2>
            </Reveal>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
