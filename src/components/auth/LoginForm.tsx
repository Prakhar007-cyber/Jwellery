"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { AuthField } from "./AuthField";
import { useToast } from "@/components/providers/ToastProvider";

/*
  Sign-in form. Uses NextAuth's credentials provider. On success
  the user is redirected to their account.
*/
export function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    // `redirect: false` lets us handle the result and show errors inline.
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Incorrect email or password.");
      return;
    }
    toast("Welcome back to ÉLANORA.");
    router.push("/account");
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm">
      <span className="eyebrow text-gold">Welcome back.</span>
      <h1 className="display mt-3 text-5xl">Sign in</h1>
      <p className="mt-3 text-sm text-espresso-soft">
        Continue your journey through timeless design.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
        <AuthField label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
        <AuthField label="Password" type="password" value={password} onChange={setPassword} autoComplete="current-password" />

        <div className="flex items-center justify-between text-xs text-espresso-soft">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-gold" />
            Remember me
          </label>
          <button type="button" className="hover:text-espresso">Forgot password?</button>
        </div>

        {error && <p className="text-xs text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-espresso py-4 text-ivory transition-colors hover:bg-ink disabled:opacity-60"
        >
          <span className="eyebrow text-ivory">{loading ? "Signing in…" : "Sign In"}</span>
        </button>
      </form>

      <div className="my-6 flex items-center gap-4 text-espresso-soft">
        <span className="h-px flex-1 bg-line" />
        <span className="eyebrow text-[0.6rem]">or</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <button
        onClick={() => signIn("google", { callbackUrl: "/account" })}
        className="w-full border border-espresso/30 py-4 transition-colors hover:border-espresso"
      >
        <span className="eyebrow">Continue with Google</span>
      </button>

      <p className="mt-8 text-center text-sm text-espresso-soft">
        New to ÉLANORA?{" "}
        <button onClick={onSwitch} className="border-b border-espresso text-espresso">
          Create an account
        </button>
      </p>

      <p className="mt-6 text-center text-[0.65rem] text-espresso-soft">
        Demo — admin@elanora.com / admin1234 · demo@elanora.com / demo1234
      </p>
    </div>
  );
}
