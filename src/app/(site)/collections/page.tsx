import Link from "next/link";
import Image from "next/image";
import { COLLECTIONS } from "@/lib/constants";
import { IMAGES, img } from "@/lib/images";
import { Reveal } from "@/components/ui/Reveal";

export const metadata = { title: "Collections — ÉLANORA" };

// Representative image per collection.
const COLLECTION_IMAGE: Record<string, string> = {
  celeste: IMAGES.ringDiamondDark,
  eternal: IMAGES.necklaceGoldSet,
  solstice: IMAGES.earringsGoldHoops,
  aurora: IMAGES.ringPinkRoseGold,
};

export default function CollectionsPage() {
  return (
    <div className="px-6 pb-24 pt-32 lg:px-14">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-14 border-b border-line pb-10 text-center">
          <span className="eyebrow text-gold">ÉLANORA</span>
          <h1 className="display mt-4 text-6xl lg:text-8xl">The Collections</h1>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {COLLECTIONS.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.08}>
              <Link href={`/collections/${c.slug}`} data-cursor="view" className="group relative block aspect-[3/2] overflow-hidden bg-pearl">
                <Image
                  src={img(COLLECTION_IMAGE[c.slug], 1100)}
                  alt={c.label}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-ink/35 transition-colors group-hover:bg-ink/45" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-ivory">
                  <span className="eyebrow text-ivory/80">{c.tagline}</span>
                  <h2 className="display mt-3 text-5xl lg:text-6xl">{c.label}</h2>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
