import { Suspense } from "react";
import { getProducts, type ProductQuery } from "@/lib/data";
import { ProductCard } from "@/components/product/ProductCard";
import { ShopSidebar, ShopTopBar } from "@/components/shop/ShopControls";
import { CATEGORIES } from "@/lib/constants";

export const metadata = { title: "Shop — ÉLANORA" };

/*
  Shop page (Server Component). Reads filters from the URL query,
  fetches matching products from MongoDB, and renders the grid with
  a filter sidebar. The header adapts to the active category.
*/
export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;

  const query: ProductQuery = {
    category: sp.category,
    collection: sp.collection,
    material: sp.material,
    inStock: sp.inStock === "1",
    sort: sp.sort as ProductQuery["sort"],
    search: sp.q,
  };

  const products = await getProducts(query);
  const activeCategory = CATEGORIES.find((c) => c.slug === sp.category);
  const title = activeCategory ? activeCategory.label : "All Jewelry";

  return (
    <div className="px-6 pb-24 pt-32 lg:px-14">
      <div className="mx-auto max-w-[1500px]">
        {/* Header */}
        <header className="mb-14 border-b border-line pb-10 text-center">
          <span className="eyebrow text-gold">ÉLANORA — The Collection</span>
          <h1 className="display mt-4 text-6xl lg:text-8xl">{title}</h1>
        </header>

        <div className="flex gap-12">
          <Suspense fallback={<aside className="hidden w-56 lg:block" />}>
            <ShopSidebar />
          </Suspense>

          <div className="flex-1">
            <Suspense fallback={<div className="mb-8 h-10" />}>
              <ShopTopBar count={products.length} />
            </Suspense>

            {products.length === 0 ? (
              <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
                <p className="display text-4xl">Nothing here yet.</p>
                <p className="mt-3 text-espresso-soft">Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 lg:gap-x-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
