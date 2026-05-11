import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
};

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "rounded-full bg-[var(--color-brand-primary)] text-white hover:bg-[var(--color-brand-secondary)] active:scale-[0.99]",
  secondary:
    "rounded-full border border-[color:var(--color-brand-border)] bg-white text-[var(--color-brand-primary)] hover:bg-[var(--color-brand-muted)] active:scale-[0.99]",
  outline:
    "rounded-full border border-[var(--color-brand-primary)] text-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary)] hover:text-white active:scale-[0.99]",
  ghost:
    "rounded-full text-[var(--color-brand-primary)]/65 hover:bg-[var(--color-brand-muted)] hover:text-[var(--color-brand-primary)]",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-6 py-2 text-[10px]",
  md: "px-8 py-3.5 text-[11px]",
  lg: "px-10 py-4 text-xs",
};

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  fullWidth = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 uppercase tracking-[0.28em] font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-accent)] focus-visible:ring-offset-2",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
