"use client";

import Image from "next/image";
import Link from "next/link";
import { IMAGES, img } from "@/lib/images";
import { Reveal } from "@/components/ui/Reveal";

/*
  Closing statement — a minimal luxury call to action over a soft,
  darkened jewelry composition.
*/
export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-ink py-40 text-ivory">
      <Image
        src={img(IMAGES.necklaceGoldPendants, 1600)}
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="object-cover opacity-25"
      />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
        <Reveal>
          <h2 className="display text-6xl leading-[0.95] sm:text-7xl lg:text-8xl">
            Find the piece
            <br />
            <span className="italic">that becomes yours.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href="/shop"
              className="bg-ivory px-10 py-4 text-espresso transition-colors hover:bg-champagne"
            >
              <span className="eyebrow">Explore Jewelry</span>
            </Link>
            <Link
              href="/about"
              className="border border-ivory/50 px-10 py-4 transition-colors hover:bg-ivory hover:text-espresso"
            >
              <span className="eyebrow">Book an Appointment</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
