"use client";

import Link from "next/link";
import { useState } from "react";
import { AtSign, Send } from "lucide-react";
import { useToast } from "@/components/providers/ToastProvider";

/*
  Editorial footer with a newsletter sign-up. The newsletter is a
  simple local form — it just shows a confirmation toast (no email
  provider wired up in this demo).
*/
export function Footer() {
  const toast = useToast();
  const [email, setEmail] = useState("");

  const columns = [
    { title: "Shop", links: [["Rings", "/shop?category=rings"], ["Necklaces", "/shop?category=necklaces"], ["Bracelets", "/shop?category=bracelets"], ["Earrings", "/shop?category=earrings"]] },
    { title: "Collections", links: [["Celeste", "/collections/celeste"], ["Eternal", "/collections/eternal"], ["Solstice", "/collections/solstice"], ["Aurora", "/collections/aurora"]] },
    { title: "Maison", links: [["Our Story", "/about"], ["Care Guide", "/about"], ["Shipping", "/about"], ["Returns", "/about"]] },
    { title: "Support", links: [["Contact", "/about"], ["Appointments", "/about"], ["Privacy", "/about"], ["Terms", "/about"]] },
  ];

  return (
    <footer className="mt-24 border-t border-line bg-pearl px-6 pt-20 pb-10 lg:px-10">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_2fr]">
          {/* Newsletter */}
          <div>
            <h2 className="font-serif text-5xl tracking-[0.15em]">ÉLANORA</h2>
            <p className="mt-6 max-w-sm text-espresso-soft">
              Private Notes from ÉLANORA — new collections, atelier stories and
              invitations, shared quietly with our members.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!email) return;
                toast("Welcome to ÉLANORA.");
                setEmail("");
              }}
              className="mt-8 flex max-w-sm items-center border-b border-espresso"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-espresso-soft"
              />
              <button type="submit" className="eyebrow shrink-0 pl-4">
                Subscribe
              </button>
            </form>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <span className="eyebrow text-espresso-soft">{col.title}</span>
                <ul className="mt-5 space-y-3">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="text-sm text-espresso transition-colors hover:text-gold"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 text-xs text-espresso-soft sm:flex-row">
          <p>© {new Date().getFullYear()} ÉLANORA Maison. Crafted to become part of your story.</p>
          <div className="flex items-center gap-4">
            <a href="https://instagram.com" aria-label="Instagram" className="hover:text-gold">
              <AtSign strokeWidth={1.2} className="h-4 w-4" />
            </a>
            <a href="https://facebook.com" aria-label="Contact" className="hover:text-gold">
              <Send strokeWidth={1.2} className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
