"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IMAGES, img } from "@/lib/images";
import { RevealHeading } from "@/components/ui/Reveal";

/*
  Editorial introduction — a luxury magazine spread. Large serif
  statement offset against a jewelry photograph with a gentle
  parallax on the image as it scrolls.
*/
export function EditorialIntro() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
      gsap.registerPlugin(ScrollTrigger);
      // Parallax: the framed image drifts slower than the page.
      gsap.to(".intro-parallax", {
        yPercent: -14,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative bg-ivory px-6 py-28 lg:px-14 lg:py-40">
      <div className="mx-auto grid max-w-[1500px] items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        {/* Text */}
        <div>
          <div className="mb-8 flex items-center gap-6 text-espresso-soft">
            <span className="eyebrow">Est. 2026</span>
            <span className="h-px w-10 bg-line" />
            <span className="eyebrow">Fine Jewelry</span>
            <span className="h-px w-10 bg-line" />
            <span className="eyebrow">ÉLANORA Atelier</span>
          </div>
          <h2 className="display text-6xl leading-[0.95] sm:text-7xl lg:text-8xl">
            <RevealHeading text="Objects of desire." />
            <br />
            <span className="italic text-gold">
              <RevealHeading text="Designed to endure." />
            </span>
          </h2>
          <p className="mt-10 max-w-md text-espresso-soft">
            Each ÉLANORA piece begins as a drawing and ends as an heirloom —
            shaped by hand, set with responsibly sourced stones, and made to be
            passed between the people you love.
          </p>
        </div>

        {/* Offset image */}
        <div className="relative">
          <div className="relative aspect-[3/4] overflow-hidden bg-pearl lg:translate-y-8">
            <Image
              src={img(IMAGES.modelDelicateNecklace, 1100)}
              alt="A model wearing delicate ÉLANORA necklaces"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="intro-parallax scale-110 object-cover"
            />
          </div>
          <span className="eyebrow absolute -left-2 top-4 rotate-180 text-espresso-soft [writing-mode:vertical-rl]">
            The ÉLANORA Woman
          </span>
        </div>
      </div>
    </section>
  );
}
