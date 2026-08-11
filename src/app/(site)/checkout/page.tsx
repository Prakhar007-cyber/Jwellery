"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { money, SHIPPING_FLAT, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

/*
  Checkout.
  ------------------------------------------------------------
  Flow: enter contact + shipping → review → place order.
  On submit we POST the cart (ids/size/quantity only) to
  /api/checkout, which recomputes the authoritative total from the
  database, creates the order, and returns a reference. We then
  clear the cart and show a confirmation.
*/

const STEPS = ["Contact", "Shipping", "Review"];

export default function CheckoutPage() {
  const { items, getCartTotal, clearCart } = useCart();
  const toast = useToast();

  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState<{ reference: string; total: number } | null>(null);

  const [form, setForm] = useState({
    email: "",
    name: "",
    phone: "",
    line1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const subtotal = getCartTotal();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FLAT;
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  async function placeOrder() {
    setPlacing(true);
    setError("");
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        shippingAddress: {
          name: form.name,
          phone: form.phone,
          line1: form.line1,
          city: form.city,
          state: form.state,
          postalCode: form.postalCode,
          country: form.country,
        },
        // Only ids/size/quantity — the server looks up real prices.
        items: items.map((i) => ({ productId: i.productId, size: i.size, quantity: i.quantity })),
      }),
    });
    const data = await res.json();
    setPlacing(false);
    if (!res.ok) return setError(data.error || "Could not place your order.");
    clearCart();
    setConfirmed({ reference: data.reference, total: data.total });
    toast("Order confirmed.");
  }

  // ---- Confirmation screen ----
  if (confirmed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full border border-gold">
          <Check className="h-7 w-7 text-gold" strokeWidth={1.2} />
        </div>
        <span className="eyebrow mt-8 text-gold">Order Confirmed</span>
        <h1 className="display mt-4 text-6xl">Thank you.</h1>
        <p className="mt-4 max-w-md text-espresso-soft">
          Your ÉLANORA order <strong>{confirmed.reference}</strong> has been received and is being
          prepared with care. A confirmation has been sent to {form.email}.
        </p>
        <p className="mt-6 font-serif text-2xl">{money(confirmed.total)}</p>
        <div className="mt-10 flex gap-4">
          <Link href="/account/orders" className="bg-espresso px-8 py-4"><span className="eyebrow text-ivory">View Orders</span></Link>
          <Link href="/shop" className="border border-espresso/30 px-8 py-4"><span className="eyebrow">Continue Shopping</span></Link>
        </div>
      </div>
    );
  }

  // ---- Empty cart guard ----
  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="display text-5xl">Your bag is empty.</p>
        <Link href="/shop" className="eyebrow mt-6 border-b border-espresso pb-1">Discover the collection</Link>
      </div>
    );
  }

  const contactValid = form.email.includes("@");
  const shippingValid = form.name && form.phone && form.line1 && form.city && form.state && form.postalCode && form.country;

  return (
    <div className="px-6 pb-24 pt-32 lg:px-14">
      <div className="mx-auto max-w-300">
        <header className="mb-12 text-center">
          <span className="eyebrow text-gold">Secure Checkout</span>
          <h1 className="display mt-3 text-5xl lg:text-6xl">Checkout</h1>
          {/* Step indicator */}
          <div className="mt-8 flex items-center justify-center gap-4">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-4">
                <span className={`eyebrow ${i <= step ? "text-espresso" : "text-espresso-soft/50"}`}>
                  {i + 1}. {s}
                </span>
                {i < STEPS.length - 1 && <span className="h-px w-8 bg-line" />}
              </div>
            ))}
          </div>
        </header>

        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          {/* Form area */}
          <div>
            {step === 0 && (
              <div className="space-y-5">
                <h2 className="font-serif text-2xl">Contact</h2>
                <Field label="Email" value={form.email} onChange={set("email")} type="email" />
                <button
                  onClick={() => contactValid && setStep(1)}
                  disabled={!contactValid}
                  className="bg-espresso px-8 py-4 disabled:opacity-50"
                >
                  <span className="eyebrow text-ivory">Continue to Shipping</span>
                </button>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <h2 className="font-serif text-2xl">Shipping Address</h2>
                <Field label="Full name" value={form.name} onChange={set("name")} />
                <Field label="Phone" value={form.phone} onChange={set("phone")} />
                <Field label="Address" value={form.line1} onChange={set("line1")} />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="City" value={form.city} onChange={set("city")} />
                  <Field label="State / Region" value={form.state} onChange={set("state")} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Postal code" value={form.postalCode} onChange={set("postalCode")} />
                  <Field label="Country" value={form.country} onChange={set("country")} />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(0)} className="border border-espresso/30 px-8 py-4"><span className="eyebrow">Back</span></button>
                  <button onClick={() => shippingValid && setStep(2)} disabled={!shippingValid} className="bg-espresso px-8 py-4 disabled:opacity-50">
                    <span className="eyebrow text-ivory">Review Order</span>
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl">Review</h2>
                <div className="border border-line p-6 text-sm">
                  <p className="eyebrow text-espresso-soft">Ship to</p>
                  <p className="mt-2">{form.name} · {form.phone}</p>
                  <p className="text-espresso-soft">{form.line1}, {form.city}, {form.state} {form.postalCode}, {form.country}</p>
                  <p className="mt-2 text-espresso-soft">{form.email}</p>
                </div>
                <div className="border border-line p-6">
                  <p className="eyebrow text-espresso-soft">Payment</p>
                  <p className="mt-2 text-sm">
                    Development payment (mock). No card is charged. Structured so Stripe / Razorpay
                    can be added server-side without changing this page.
                  </p>
                </div>
                {error && <p className="text-sm text-red-700">{error}</p>}
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="border border-espresso/30 px-8 py-4"><span className="eyebrow">Back</span></button>
                  <button onClick={placeOrder} disabled={placing} className="bg-espresso px-8 py-4 disabled:opacity-60">
                    <span className="eyebrow text-ivory">{placing ? "Placing order…" : "Place Order"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className="h-fit border border-line p-8 lg:sticky lg:top-28">
            <h2 className="font-serif text-2xl">Your Order</h2>
            <div className="mt-6 space-y-4 border-b border-line pb-6">
              {items.map((item) => (
                <div key={item.productId + (item.size || "")} className="flex gap-4">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-pearl">
                    <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="flex flex-1 justify-between text-sm">
                    <div>
                      <p className="font-serif">{item.name}</p>
                      <p className="text-espresso-soft">Qty {item.quantity}{item.size ? ` · ${item.size}` : ""}</p>
                    </div>
                    <span>{money(item.price * item.quantity)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-espresso-soft">Subtotal</span><span>{money(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-espresso-soft">Shipping</span><span>{shipping === 0 ? "Complimentary" : money(shipping)}</span></div>
            </div>
            <div className="mt-4 flex justify-between border-t border-line pt-4 font-serif text-xl">
              <span>Total</span><span>{money(subtotal + shipping)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="eyebrow mb-2 block text-[0.62rem] text-espresso-soft">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full border-b border-espresso/30 bg-transparent py-2.5 outline-none focus:border-espresso"
      />
    </label>
  );
}
