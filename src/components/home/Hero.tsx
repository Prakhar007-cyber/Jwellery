"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";
import { IMAGES, img } from "@/lib/images";

/*
  Hero — the signature moment of the site.
  ------------------------------------------------------------
  1. ENTRANCE (on load): the image is revealed with a clip-path
     mask, the headline lines rise in sequence, and the small
     editorial details fade in.
  2. SCROLL TRANSITION: the section is 2 screens tall with a
     sticky visual. As you scroll the second screen, the full-
     bleed image scales down into a framed "campaign" inside the
     warm ivory page — the hero's cinematic hand-off to the story.
*/
export function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.registerPlugin(ScrollTrigger);

      // ---- 1. Entrance timeline ----
      if (!reduce) {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(".hero-visual", { clipPath: "inset(100% 0% 0% 0%)", duration: 1.4, ease: "power4.inOut" })
          .from(".hero-scale", { scale: 1.3, duration: 1.6, ease: "power4.out" }, 0)
          .from(".hero-line span", { yPercent: 120, duration: 1.1, stagger: 0.12 }, 0.5)
          .from(".hero-fade", { opacity: 0, y: 20, duration: 1, stagger: 0.15 }, 1);
      }

      // ---- 2. Scroll transition (sticky + scrub) ----
      if (!reduce) {
        const tl2 = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        });
        // Image shrinks into a framed campaign; headline drifts up and apart.
        tl2
          .to(".hero-frame", { scale: 0.78, borderRadius: 4, ease: "none" }, 0)
          .to(".hero-scale", { scale: 1.15, ease: "none" }, 0)
          .to(".hero-heading", { yPercent: -40, letterSpacing: "0.05em", ease: "none" }, 0)
          .to(".hero-veil", { opacity: 0.55, ease: "none" }, 0)
          .to(".hero-fade", { opacity: 0, ease: "none" }, 0);
      }
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative h-[200vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* Framed campaign visual */}
        <div className="hero-frame relative h-full w-full overflow-hidden">
          <div className="hero-visual grain relative h-full w-full overflow-hidden">
            <Image
              src={img(IMAGES.heroModelGoldChain, 2000)}
              alt="An ÉLANORA model wearing layered gold chains"
              fill
              priority
              sizes="100vw"
              className="hero-scale object-cover"
            />
            {/* Darkening veil for legible type */}
            <div className="hero-veil absolute inset-0 bg-gradient-to-b from-ink/45 via-ink/20 to-ink/60" />
          </div>

          {/* Overlaid editorial content */}
          <div className="absolute inset-0 flex flex-col justify-between px-6 py-24 text-ivory lg:px-14 lg:py-16">
            {/* Top row: tagline + est. */}
            <div className="hero-fade flex items-start justify-between pt-10">
              <span className="eyebrow max-w-[10rem] leading-relaxed text-ivory/80">
                Crafted to become part of your story.
              </span>
              <span className="eyebrow hidden text-ivory/70 sm:block">Est. 2026 — Fine Jewelry</span>
            </div>

            {/* Center: headline */}
            <div className="hero-heading mx-auto -mt-8 max-w-5xl text-center">
              <h1 className="display text-[19vw] leading-[0.85] sm:text-[14vw] lg:text-[10.5vw]">
                <span className="line-mask">
                  <span className="hero-line inline-block">Jewelry,</span>
                </span>
                <span className="line-mask italic">
                  <span className="hero-line inline-block font-light">made eternal.</span>
                </span>
              </h1>
              <p className="hero-fade mx-auto mt-8 max-w-md text-sm text-ivory/85 lg:text-base">
                An exploration of form, light and timeless craftsmanship.
              </p>
              <div className="hero-fade mt-8">
                <Link
                  href="/shop"
                  className="group inline-flex items-center gap-3 border border-ivory/50 px-8 py-4 transition-colors hover:bg-ivory hover:text-espresso"
                >
                  <span className="eyebrow">Discover the Collection</span>
                </Link>
              </div>
            </div>

            {/* Bottom: scroll cue */}
            <div className="hero-fade flex items-center justify-center gap-3 text-ivory/70">
              <ArrowDown className="h-4 w-4 animate-bounce" strokeWidth={1} />
              <span className="eyebrow text-[0.6rem]">Scroll to explore</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
