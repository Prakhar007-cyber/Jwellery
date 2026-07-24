"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IMAGES, img } from "@/lib/images";
import { RevealHeading } from "@/components/ui/Reveal";

/*
  The Celeste Collection — a cinematic, dark campaign section.
  Two overlapping close-ups parallax at different speeds while the
  editorial copy reveals. Feels like a digital campaign, not a grid.
*/
export function SignatureCollection() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
      gsap.registerPlugin(ScrollTrigger);
      const st = (el: string, y: number) =>
        gsap.to(el, {
          yPercent: y,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        });
      st(".celeste-a", -18);
      st(".celeste-b", 12);
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-ink px-6 py-28 text-ivory lg:px-14 lg:py-40">
      <div className="mx-auto grid max-w-[1500px] items-center gap-16 lg:grid-cols-2">
        {/* Copy */}
        <div className="order-2 lg:order-1">
          <span className="eyebrow text-gold-soft">The Celeste Collection</span>
          <h2 className="display mt-6 text-6xl leading-[0.9] sm:text-7xl lg:text-8xl">
            <RevealHeading text="Born from light." />
            <br />
            <span className="italic">
              <RevealHeading text="Shaped for eternity." />
            </span>
          </h2>
          <p className="mt-8 max-w-md text-ivory/70">
            A study in brilliance — lab-grown diamonds set in white gold and
            platinum, cut to hold light the way the night sky holds stars. Our
            most enduring designs, made to be worn for generations.
          </p>
          <Link
            href="/collections/celeste"
            className="mt-10 inline-block border border-ivory/40 px-8 py-4 transition-colors hover:bg-ivory hover:text-ink"
          >
            <span className="eyebrow">Explore Celeste</span>
          </Link>
        </div>

        {/* Overlapping visuals */}
        <div className="relative order-1 h-[70vh] min-h-[440px] lg:order-2">
          <div className="celeste-a absolute right-0 top-0 h-[62%] w-[68%] overflow-hidden">
            <Image
              src={img(IMAGES.ringDiamondDark, 900)}
              alt="Celeste diamond ring close-up"
              fill
              sizes="40vw"
              className="object-cover"
            />
          </div>
          <div className="celeste-b absolute bottom-0 left-0 h-[55%] w-[55%] overflow-hidden border-8 border-ink">
            <Image
              src={img(IMAGES.braceletDiamondDark, 800)}
              alt="Celeste diamond bracelet close-up"
              fill
              sizes="35vw"
              className="object-cover"
            />
          </div>
          <span className="eyebrow absolute -left-2 bottom-8 text-ivory/50 [writing-mode:vertical-rl]">
            No. 01 — Celeste
          </span>
        </div>
      </div>
    </section>
  );
}
