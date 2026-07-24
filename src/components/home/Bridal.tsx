"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IMAGES, img } from "@/lib/images";
import { Reveal } from "@/components/ui/Reveal";

/*
  Bridal — an emotional full-width section with a slow parallax on
  the background wedding photograph.
*/
export function Bridal() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
      gsap.registerPlugin(ScrollTrigger);
      gsap.to(".bridal-bg", {
        yPercent: 14,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative h-[90vh] min-h-[560px] overflow-hidden">
      <Image
        src={img(IMAGES.weddingCouple, 1900)}
        alt="A couple on their wedding day"
        fill
        sizes="100vw"
        className="bridal-bg scale-110 object-cover"
      />
      <div className="absolute inset-0 bg-ink/40" />
      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center text-ivory">
        <Reveal>
          <span className="eyebrow text-ivory/80">ÉLANORA Bridal</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="display mt-6 text-6xl leading-[0.95] sm:text-7xl lg:text-8xl">
            For the promises
            <br />
            <span className="italic">that last.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <Link
            href="/shop?category=wedding"
            className="mt-10 inline-block border border-ivory/60 px-10 py-4 transition-colors hover:bg-ivory hover:text-espresso"
          >
            <span className="eyebrow">Explore Bridal</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
