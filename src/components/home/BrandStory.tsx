"use client";

import Image from "next/image";
import { IMAGES, img } from "@/lib/images";
import { Reveal, RevealHeading } from "@/components/ui/Reveal";

/*
  Brand story — "Made slowly. Worn forever." Overlapping images of
  craftsmanship and materials, revealed with staggered scroll
  animations. Deliberately light on text.
*/
export function BrandStory() {
  return (
    <section className="bg-ivory px-6 py-28 lg:px-14 lg:py-40">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Image cluster */}
          <div className="relative h-[80vh] min-h-[520px]">
            <Reveal className="absolute left-0 top-0 h-[58%] w-[62%]">
              <div className="relative h-full w-full overflow-hidden bg-pearl">
                <Image src={img(IMAGES.modelHandsBracelet, 900)} alt="Hands wearing ÉLANORA jewelry" fill sizes="35vw" className="object-cover" />
              </div>
            </Reveal>
            <Reveal delay={0.15} className="absolute bottom-0 right-0 h-[52%] w-[52%]">
              <div className="relative h-full w-full overflow-hidden border-8 border-ivory bg-pearl">
                <Image src={img(IMAGES.goldBars, 800)} alt="Responsibly sourced gold" fill sizes="30vw" className="object-cover" />
              </div>
            </Reveal>
            <Reveal delay={0.3} className="absolute bottom-10 left-6 h-[34%] w-[34%]">
              <div className="relative h-full w-full overflow-hidden border-8 border-ivory bg-pearl">
                <Image src={img(IMAGES.earringsGoldHoops, 700)} alt="Hand-finished gold hoops" fill sizes="20vw" className="object-cover" />
              </div>
            </Reveal>
          </div>

          {/* Text */}
          <div>
            <span className="eyebrow text-gold">The ÉLANORA way</span>
            <h2 className="display mt-6 text-6xl leading-[0.9] sm:text-7xl lg:text-8xl">
              <RevealHeading text="Made slowly." />
              <br />
              <span className="italic">
                <RevealHeading text="Worn forever." />
              </span>
            </h2>
            <p className="mt-8 max-w-md text-espresso-soft">
              We work with a small circle of master goldsmiths. Every setting is
              raised by hand, every stone chosen for character over carat. It is
              a slower way to make jewelry — and the only way we know.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
