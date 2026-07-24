"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { IMAGES, img } from "@/lib/images";

/*
  Split-screen authentication experience.
  ------------------------------------------------------------
  One component drives both sign-in and sign-up. Switching modes
  animates the campaign image across the viewport (~800ms) while
  the form crossfades — no full page navigation. The URL is kept
  in sync with history.replaceState for shareable links.
*/

const EASE = [0.16, 1, 0.3, 1] as const;

export function AuthExperience({ initialMode }: { initialMode: "login" | "signup" }) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const isLogin = mode === "login";

  function switchTo(next: "login" | "signup") {
    setMode(next);
    window.history.replaceState(null, "", next === "login" ? "/login" : "/signup");
  }

  const imageCol = isLogin ? "0%" : "50%";
  const formCol = isLogin ? "50%" : "0%";

  return (
    <div className="relative min-h-screen bg-ivory">
      {/* Small top bar with the wordmark */}
      <Link
        href="/"
        className="absolute left-1/2 top-6 z-30 -translate-x-1/2 font-serif text-2xl tracking-[0.25em] text-espresso lg:left-8 lg:translate-x-0"
      >
        ÉLANORA
      </Link>

      {/* ---------- Desktop: animated split screen ---------- */}
      <div className="relative hidden min-h-screen lg:block">
        {/* Image panel (slides left ↔ right) */}
        <motion.div
          animate={{ left: imageCol }}
          transition={{ duration: 0.85, ease: EASE }}
          className="absolute top-0 h-full w-1/2 overflow-hidden"
        >
          {/* Crossfade between the two campaign photographs */}
          {[
            { id: IMAGES.heroModelGoldChain, active: isLogin },
            { id: IMAGES.modelDelicateNecklace, active: !isLogin },
          ].map((im) => (
            <motion.div
              key={im.id}
              animate={{ opacity: im.active ? 1 : 0 }}
              transition={{ duration: 0.85 }}
              className="absolute inset-0"
            >
              <motion.div
                animate={{ scale: [1, 1.08] }}
                transition={{ duration: 18, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
                className="relative h-full w-full"
              >
                <Image src={img(im.id, 1400)} alt="ÉLANORA campaign" fill priority sizes="50vw" className="object-cover" />
              </motion.div>
            </motion.div>
          ))}
          <div className="absolute inset-0 bg-ink/35" />
          <div className="absolute inset-0 flex flex-col justify-end p-14 text-ivory">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <h2 className="display text-6xl">{isLogin ? "Welcome back." : "Begin your story."}</h2>
                <p className="mt-4 max-w-xs text-ivory/80">
                  {isLogin
                    ? "Continue your journey through timeless design."
                    : "Crafted to become part of your story."}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Form panel (slides opposite) */}
        <motion.div
          animate={{ left: formCol }}
          transition={{ duration: 0.85, ease: EASE }}
          className="absolute top-0 flex h-full w-1/2 items-center justify-center px-16"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex w-full justify-center"
            >
              {isLogin ? (
                <LoginForm onSwitch={() => switchTo("signup")} />
              ) : (
                <SignupForm onSwitch={() => switchTo("login")} />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ---------- Mobile: image banner + form ---------- */}
      <div className="lg:hidden">
        <div className="relative h-56 overflow-hidden">
          <Image
            src={img(isLogin ? IMAGES.heroModelGoldChain : IMAGES.modelDelicateNecklace, 900)}
            alt="ÉLANORA campaign"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-ink/35" />
          <div className="absolute inset-0 flex items-end p-6 text-ivory">
            <h2 className="display text-4xl">{isLogin ? "Welcome back." : "Begin your story."}</h2>
          </div>
        </div>
        <div className="flex justify-center px-6 py-12">
          {isLogin ? (
            <LoginForm onSwitch={() => switchTo("signup")} />
          ) : (
            <SignupForm onSwitch={() => switchTo("login")} />
          )}
        </div>
      </div>
    </div>
  );
}
