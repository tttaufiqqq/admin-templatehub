"use client";

import { useEffect, type ReactNode } from "react";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  contentClassName,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
          <motion.button
            aria-label="Close modal overlay"
            className="absolute inset-0 bg-[rgba(16,28,44,0.62)] backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={cn(
              "relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] border border-[color:var(--color-brand-border)] bg-white shadow-[0_30px_80px_rgba(16,28,44,0.24)]",
              className,
            )}
            exit={{ opacity: 0, scale: 0.96, y: 24 }}
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between border-b border-[color:var(--color-brand-border)] px-5 py-4 sm:px-8 sm:py-5">
              <h2 className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--color-brand-primary)]">
                {title}
              </h2>
              <button
                aria-label="Close modal"
                className="rounded-full border border-[color:var(--color-brand-border)] p-2 text-[var(--color-brand-primary)] transition-colors hover:bg-[var(--color-brand-primary)] hover:text-white"
                onClick={onClose}
                type="button"
              >
                <X size={14} />
              </button>
            </div>
            <div
              className={cn(
                "overflow-y-auto p-5 sm:p-8",
                contentClassName,
              )}
            >
              {children}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
