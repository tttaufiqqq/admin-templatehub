"use client";

import { useEffect } from "react";

import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Info, TriangleAlert, X, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";

export type ToastTone = "success" | "error" | "info" | "warning";

export type ToastProps = {
  isVisible: boolean;
  message: string;
  tone?: ToastTone;
  duration?: number;
  onClose: () => void;
};

const toneClasses: Record<ToastTone, string> = {
  error: "border-[#d6b1a6] bg-[#fff4ef] text-[#8f3a2f]",
  info:
    "border-[color:var(--color-brand-border)] bg-white text-[var(--color-brand-primary)]",
  success: "border-[#b9d9c7] bg-[#f2fbf5] text-[#245a3f]",
  warning: "border-[#ddc79d] bg-[#fff9ee] text-[#7f6132]",
};

const toneIcons = {
  error: XCircle,
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
} as const;

export function Toast({
  isVisible,
  message,
  tone = "info",
  duration = 3200,
  onClose,
}: ToastProps) {
  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const timeoutId = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(timeoutId);
  }, [duration, isVisible, onClose]);

  const Icon = toneIcons[tone];

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="fixed bottom-8 left-1/2 z-[140] w-[min(30rem,calc(100%-2rem))] -translate-x-1/2"
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div
            className={cn(
              "flex items-center gap-3 rounded-[18px] border px-4 py-3 shadow-[0_20px_40px_rgba(16,28,44,0.14)]",
              toneClasses[tone],
            )}
          >
            <Icon size={18} />
            <p className="flex-1 text-[10px] font-semibold uppercase tracking-[0.24em]">
              {message}
            </p>
            <button aria-label="Close toast" onClick={onClose} type="button">
              <X size={14} />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
