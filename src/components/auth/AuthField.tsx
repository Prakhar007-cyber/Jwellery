"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/*
  Minimal underline input with a floating-ish label and an optional
  password reveal toggle. Used across the login and signup forms.
*/
export function AuthField({
  label,
  type = "text",
  value,
  onChange,
  autoComplete,
  required = true,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  required?: boolean;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && show ? "text" : type;

  return (
    <label className="block">
      <span className="eyebrow mb-2 block text-[0.62rem] text-espresso-soft">{label}</span>
      <div className="relative flex items-center border-b border-espresso/30 focus-within:border-espresso">
        <input
          type={inputType}
          value={value}
          required={required}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent py-2.5 text-base outline-none"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="pl-2 text-espresso-soft"
          >
            {show ? <EyeOff className="h-4 w-4" strokeWidth={1.3} /> : <Eye className="h-4 w-4" strokeWidth={1.3} />}
          </button>
        )}
      </div>
    </label>
  );
}
