"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type SelectOption = {
  label: string;
  value: string;
};

type SelectFieldProps = {
  name: string;
  options: SelectOption[];
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  panelClassName?: string;
};

export function SelectField({
  name,
  options,
  defaultValue = "",
  placeholder = "Select an option",
  className,
  panelClassName,
}: SelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const listboxId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === selectedValue) ?? null,
    [options, selectedValue],
  );

  return (
    <div className={cn("relative", className)} ref={rootRef}>
      <input name={name} type="hidden" value={selectedValue} />
      <button
        aria-controls={listboxId}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={cn(
          "flex w-full items-center justify-between rounded-[22px] border border-[color:var(--color-brand-border)] bg-white/88 px-4 py-3 text-left text-sm text-[var(--color-brand-primary)] shadow-[0_12px_30px_rgba(24,50,68,0.05)] transition-all hover:border-[var(--color-brand-primary)]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-accent)] focus-visible:ring-offset-2",
          isOpen && "border-[var(--color-brand-primary)]/40 shadow-[0_16px_40px_rgba(24,50,68,0.1)]",
        )}
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span className={cn(!selectedOption && "text-[var(--color-brand-primary)]/45")}>
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-[var(--color-brand-primary)]/55 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen ? (
        <div
          className={cn(
            "absolute left-0 right-0 top-[calc(100%+0.65rem)] z-20 overflow-hidden rounded-[24px] border border-[color:var(--color-brand-border)] bg-[var(--color-brand-surface)] shadow-[0_28px_60px_rgba(24,50,68,0.16)]",
            panelClassName,
          )}
        >
          <div
            aria-label={name}
            className="max-h-72 overflow-y-auto p-2"
            id={listboxId}
            role="listbox"
          >
            {options.map((option) => {
              const isSelected = option.value === selectedValue;

              return (
                <button
                  aria-selected={isSelected}
                  className={cn(
                    "flex w-full items-center justify-between rounded-[18px] px-4 py-3 text-left text-sm text-[var(--color-brand-primary)] transition-colors",
                    isSelected
                      ? "bg-[var(--color-brand-primary)] text-white"
                      : "hover:bg-[var(--color-brand-muted)]/75",
                  )}
                  key={option.value || "__empty__"}
                  onClick={() => {
                    setSelectedValue(option.value);
                    setIsOpen(false);
                  }}
                  role="option"
                  type="button"
                >
                  <span>{option.label}</span>
                  {isSelected ? <Check className="h-4 w-4" /> : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
