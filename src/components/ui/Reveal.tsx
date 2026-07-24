"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/*
  Reveal-on-scroll helpers built on GSAP ScrollTrigger (the same
  scroll system used across the site, so behaviour is consistent
  and reliable with Lenis smooth scrolling).

  Reveal        — fades + rises a block into view once.
  RevealHeading — word-by-word masked rise for editorial statements.

  Both use gsap.from(), so the *resting* state is the natural,
  fully-visible DOM — animation only plays it in.
*/

export function Reveal({
  children,
  delay = 0,
  y = 30,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.registerPlugin(ScrollTrigger);
      gsap.from(ref.current, {
        opacity: 0,
        y,
        duration: 0.9,
        delay,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function RevealHeading({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const words = text.split(" ");

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.registerPlugin(ScrollTrigger);
      gsap.from(ref.current!.querySelectorAll(".rh-word"), {
        yPercent: 120,
        duration: 1,
        ease: "power4.out",
        stagger: 0.07,
        scrollTrigger: { trigger: ref.current, start: "top 92%", once: true },
      });
    },
    { scope: ref }
  );

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className="mr-[0.25em]"
          style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}
        >
          <span className="rh-word" style={{ display: "inline-block" }}>
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}
