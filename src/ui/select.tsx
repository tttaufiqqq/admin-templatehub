"use client";

import { useEffect, useRef, useState } from "react";

import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type SelectOption = {
  label: string;
  value: string | number;
};

export type SelectProps = {
  options: SelectOption[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  className?: string;
  label?: string;
};

export function Select({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className,
  label,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      {label ? (
        <label className="mb-2 block px-1 text-[9px] font-semibold uppercase tracking-[0.28em] text-[var(--color-brand-primary)]/42">
          {label}
        </label>
      ) : null}
      <button
        className="group flex w-full items-center justify-between rounded-[18px] border border-[color:var(--color-brand-border)] bg-white px-4 py-3 text-left transition-all hover:border-[var(--color-brand-primary)]"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span
          className={cn(
            "text-[11px] font-medium tracking-wide",
            selectedOption
              ? "text-[var(--color-brand-primary)]"
              : "text-[var(--color-brand-primary)]/38",
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-[var(--color-brand-primary)]/25 group-hover:text-[var(--color-brand-primary)]/45"
        >
          <ChevronDown size={14} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-[22px] border border-[color:var(--color-brand-border)] bg-white shadow-[0_24px_60px_rgba(16,28,44,0.16)]"
          >
            <div className="max-h-60 overflow-y-auto py-2">
              {options.map((option) => (
                <button
                  key={option.value}
                  className={cn(
                    "w-full px-4 py-2.5 text-left text-[11px] font-medium transition-colors hover:bg-[var(--color-brand-bg)]",
                    value === option.value
                      ? "bg-[var(--color-brand-bg)] text-[var(--color-brand-primary)]"
                      : "text-[var(--color-brand-primary)]/62",
                  )}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
