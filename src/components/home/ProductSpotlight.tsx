"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IMAGES, img } from "@/lib/images";
import { money } from "@/lib/constants";

/*
  Product spotlight — inspect a single signature piece. Editorial
  annotations fade in around the photograph as it scrolls into
  view, with a subtle parallax on the image itself.
*/

const NOTES = [
  { label: "18K White Gold", side: "left", top: "18%" },
  { label: "Lab-Grown Diamond", side: "left", top: "62%" },
  { label: "Hand Finished", side: "right", top: "30%" },
  { label: "Limited Collection", side: "right", top: "72%" },
];

export function ProductSpotlight() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
      gsap.registerPlugin(ScrollTrigger);
      gsap.to(".spotlight-img", {
        yPercent: -8,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="bg-pearl px-6 py-28 lg:px-14 lg:py-40">
      <div className="mx-auto max-w-4xl text-center">
        <span className="eyebrow text-gold">In focus</span>
        <h2 className="display mt-4 text-5xl lg:text-7xl">The Celeste Solitaire</h2>
      </div>

      <div className="relative mx-auto mt-16 max-w-lg">
        {/* Photograph */}
        <div className="relative aspect-[4/5] overflow-hidden bg-ivory">
          <Image
            src={img(IMAGES.ringDiamondDark, 1000)}
            alt="The Celeste diamond solitaire ring"
            fill
            sizes="(max-width: 1024px) 90vw, 40vw"
            className="spotlight-img scale-110 object-cover"
          />
        </div>

        {/* Annotations (absolute on desktop, listed on mobile) */}
        {NOTES.map((note, i) => (
          <motion.div
            key={note.label}
            initial={{ opacity: 0, x: note.side === "left" ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, delay: 0.15 * i, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute hidden items-center gap-4 lg:flex ${
              note.side === "left" ? "right-full pr-6 flex-row-reverse text-right" : "left-full pl-6"
            }`}
            style={{ top: note.top }}
          >
            <span className="h-px w-16 bg-espresso/40" />
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            <span className="eyebrow whitespace-nowrap text-espresso">{note.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Mobile annotations + CTA */}
      <div className="mx-auto mt-12 max-w-lg text-center">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 lg:hidden">
          {NOTES.map((n) => (
            <span key={n.label} className="eyebrow text-espresso-soft">
              {n.label}
            </span>
          ))}
        </div>
        <p className="mt-6 font-serif text-2xl">{money(4200)}</p>
        <Link
          href="/product/celeste-diamond-ring"
          className="mt-6 inline-block bg-espresso px-10 py-4 text-ivory transition-colors hover:bg-ink"
        >
          <span className="eyebrow text-ivory">View the Piece</span>
        </Link>
      </div>
    </section>
  );
}
