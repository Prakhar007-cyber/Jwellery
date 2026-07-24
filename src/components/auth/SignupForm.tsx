"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { AuthField } from "./AuthField";
import { useToast } from "@/components/providers/ToastProvider";

/*
  Create-account form. Validates input, shows password strength,
  creates the user via /api/signup, then signs them in automatically.
*/

// Simple 0–3 password strength score based on length + variety.
function scorePassword(pw: string): number {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const STRENGTH_LABELS = ["Too short", "Fair", "Good", "Strong"];

export function SignupForm({ onSwitch }: { onSwitch: () => void }) {
  const router = useRouter();
  const toast = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const strength = scorePassword(password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    if (!terms) return setError("Please accept the terms to continue.");

    setLoading(true);
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      return setError(data.error || "Could not create account.");
    }

    // Auto sign-in after successful registration.
    await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    toast("Welcome to ÉLANORA.");
    router.push("/account");
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm">
      <span className="eyebrow text-gold">Begin your story.</span>
      <h1 className="display mt-3 text-5xl">Create account</h1>
      <p className="mt-3 text-sm text-espresso-soft">
        Join ÉLANORA for private previews and saved pieces.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <AuthField label="First name" value={firstName} onChange={setFirstName} autoComplete="given-name" />
          <AuthField label="Last name" value={lastName} onChange={setLastName} autoComplete="family-name" />
        </div>
        <AuthField label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
        <AuthField label="Password" type="password" value={password} onChange={setPassword} autoComplete="new-password" />

        {password && (
          <div className="flex items-center gap-2">
            <div className="flex flex-1 gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`h-0.5 flex-1 rounded-full ${i < strength ? "bg-gold" : "bg-line"}`}
                />
              ))}
            </div>
            <span className="text-[0.6rem] text-espresso-soft">{STRENGTH_LABELS[strength]}</span>
          </div>
        )}

        <AuthField label="Confirm password" type="password" value={confirm} onChange={setConfirm} autoComplete="new-password" />

        <label className="flex items-start gap-2 text-xs text-espresso-soft">
          <input
            type="checkbox"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            className="mt-0.5 accent-gold"
          />
          I agree to the ÉLANORA Terms of Service and Privacy Policy.
        </label>

        {error && <p className="text-xs text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-espresso py-4 text-ivory transition-colors hover:bg-ink disabled:opacity-60"
        >
          <span className="eyebrow text-ivory">{loading ? "Creating…" : "Create Account"}</span>
        </button>
      </form>

      <button
        onClick={() => signIn("google", { callbackUrl: "/account" })}
        className="mt-4 w-full border border-espresso/30 py-4 transition-colors hover:border-espresso"
      >
        <span className="eyebrow">Continue with Google</span>
      </button>

      <p className="mt-6 text-center text-sm text-espresso-soft">
        Already have an account?{" "}
        <button onClick={onSwitch} className="border-b border-espresso text-espresso">
          Sign in
        </button>
      </p>
    </div>
  );
}
