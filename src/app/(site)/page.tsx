import { getFeaturedProducts } from "@/lib/data";
import { Hero } from "@/components/home/Hero";
import { EditorialIntro } from "@/components/home/EditorialIntro";
import { ShopByCategory } from "@/components/home/ShopByCategory";
import { SignatureCollection } from "@/components/home/SignatureCollection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { ProductSpotlight } from "@/components/home/ProductSpotlight";
import { BrandStory } from "@/components/home/BrandStory";
import { Marquee } from "@/components/home/Marquee";
import { Bridal } from "@/components/home/Bridal";
import { Gallery } from "@/components/home/Gallery";
import { FinalCta } from "@/components/home/FinalCta";

/*
  ÉLANORA landing page.
  A Server Component: it fetches featured products from MongoDB and
  passes them to the client sections. Everything is composed as a
  cinematic, scroll-driven luxury campaign.
*/
// Re-generate the home page at most once a minute so featured
// products stay fresh without a database hit on every request.
export const revalidate = 60;

export default async function HomePage() {
  const featured = await getFeaturedProducts(8);

  return (
    <>
      <Hero />
      <EditorialIntro />
      <ShopByCategory />
      <SignatureCollection />
      <FeaturedProducts products={featured} />
      <ProductSpotlight />
      <BrandStory />
      <Marquee />
      <Bridal />
      <Gallery />
      <FinalCta />
    </>
  );
}
