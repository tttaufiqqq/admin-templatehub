"use client";

import type { ReactNode } from "react";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

export type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export function Drawer({ isOpen, onClose, title, children }: DrawerProps) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            aria-label="Close drawer overlay"
            className="fixed inset-0 z-[90] bg-[rgba(16,28,44,0.5)] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            animate={{ x: 0 }}
            className="fixed right-0 top-0 z-[100] flex h-full w-full max-w-md flex-col border-l border-[color:var(--color-brand-border)] bg-white shadow-[0_0_80px_rgba(16,28,44,0.18)]"
            exit={{ x: "100%" }}
            initial={{ x: "100%" }}
            transition={{ duration: 0.26, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between border-b border-[color:var(--color-brand-border)] px-5 py-5 sm:px-8">
              <h2 className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--color-brand-primary)]">
                {title}
              </h2>
              <button
                aria-label="Close drawer"
                className="rounded-full border border-[color:var(--color-brand-border)] p-2 text-[var(--color-brand-primary)] transition-colors hover:bg-[var(--color-brand-primary)] hover:text-white"
                onClick={onClose}
                type="button"
              >
                <X size={14} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 sm:p-8">{children}</div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
