"use client";

import Image from "next/image";
import { IMAGES, img } from "@/lib/images";
import { Reveal } from "@/components/ui/Reveal";

/*
  Editorial gallery (@elanora). An asymmetric grid of lifestyle
  imagery — purely visual, no real Instagram API. Mixed portrait /
  square tiles reveal as they scroll into view.
*/

const SHOTS = [
  { id: IMAGES.modelPendantWhite, span: "row-span-2", alt: "Pendant necklace styling" },
  { id: IMAGES.modelGoldBangles, span: "", alt: "Gold bangles styling" },
  { id: IMAGES.modelNecklacesBlouse, span: "", alt: "Layered necklaces" },
  { id: IMAGES.fashionPortraitDark, span: "row-span-2", alt: "ÉLANORA campaign portrait" },
  { id: IMAGES.necklaceGoldPendants, span: "", alt: "Gold pendants" },
  { id: IMAGES.modelRingsNecklace, span: "", alt: "Rings and necklace" },
];

export function Gallery() {
  return (
    <section className="bg-ivory px-6 py-24 lg:px-14">
      <div className="mx-auto max-w-[1500px]">
        <Reveal className="mb-12 text-center">
          <span className="eyebrow text-gold">@elanora</span>
          <h2 className="display mt-4 text-5xl lg:text-7xl">Worn by you</h2>
          <p className="mt-4 text-espresso-soft">Share your ÉLANORA moments — tag @elanora to be featured.</p>
        </Reveal>

        <div className="grid auto-rows-[220px] grid-cols-2 gap-3 md:grid-cols-4 lg:auto-rows-[260px]">
          {SHOTS.map((shot, i) => (
            <Reveal
              key={i}
              delay={(i % 4) * 0.06}
              className={`group relative overflow-hidden bg-pearl ${shot.span}`}
            >
              <Image
                src={img(shot.id, 800)}
                alt={shot.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/15" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
