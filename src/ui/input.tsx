import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({
  className,
  label,
  error,
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label ? (
        <label className="mb-2 block px-1 text-[9px] font-semibold uppercase tracking-[0.28em] text-[var(--color-brand-primary)]/42">
          {label}
        </label>
      ) : null}
      <input
        {...props}
        className={cn(
          "w-full rounded-[18px] border border-[color:var(--color-brand-border)] bg-white px-4 py-3 text-[11px] font-medium tracking-wide text-[var(--color-brand-primary)] placeholder:text-[var(--color-brand-primary)]/24 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-accent)] focus:ring-offset-2",
          error && "border-[#c87f6d] bg-[#fff8f5]",
          className,
        )}
      />
      {error ? (
        <p className="mt-2 px-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8f3a2f]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
