import Image from "next/image";
import { IMAGES, img } from "@/lib/images";
import { Reveal, RevealHeading } from "@/components/ui/Reveal";

export const metadata = { title: "Our Story — ÉLANORA" };

// Brand story / about page — editorial and image-led.
export default function AboutPage() {
  return (
    <div className="pt-32">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <span className="eyebrow text-gold">Est. 2026 — ÉLANORA Maison</span>
        <h1 className="display mt-6 text-6xl leading-[0.95] lg:text-8xl">
          <RevealHeading text="Crafted to become" />
          <br />
          <span className="italic"><RevealHeading text="part of your story." /></span>
        </h1>
        <p className="mt-8 text-espresso-soft">
          ÉLANORA is a European fine jewelry house founded on a simple belief: that
          the objects we wear closest to us should be made slowly, and meant to last.
        </p>
      </div>

      <div className="mx-auto mt-20 max-w-350 px-6 lg:px-14">
        <div className="relative aspect-video overflow-hidden bg-pearl">
          <Image src={img(IMAGES.modelGoldBangles, 1800)} alt="ÉLANORA craftsmanship" fill sizes="100vw" className="object-cover" />
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-24">
        <Reveal>
          <h2 className="display text-4xl">The atelier</h2>
          <p className="mt-6 text-espresso-soft">
            Every ÉLANORA piece begins as a sketch and is brought to life by a small
            circle of master goldsmiths. We work with responsibly sourced stones and
            recycled precious metals, hand-finishing each setting to catch the light.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="display mt-16 text-4xl">Our promise</h2>
          <p className="mt-6 text-espresso-soft">
            We design for permanence, not seasons. From engagement rings to everyday
            gold, each creation is hallmarked, guaranteed, and cared for by our atelier
            for life — because the best jewelry is the kind you never take off.
          </p>
        </Reveal>
      </div>

      <div className="grid gap-1 sm:grid-cols-3">
        {[IMAGES.modelDelicateNecklace, IMAGES.braceletGoldChain, IMAGES.earringsGoldHoops].map((im, i) => (
          <div key={i} className="relative aspect-square overflow-hidden bg-pearl">
            <Image src={img(im, 800)} alt="ÉLANORA" fill sizes="33vw" className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
