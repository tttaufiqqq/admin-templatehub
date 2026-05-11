"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { AnimatePresence, motion } from "motion/react";

type TooltipPosition = "top" | "bottom" | "left" | "right";

export type TooltipProps = {
  content: string;
  children: ReactNode;
  position?: TooltipPosition;
  delay?: number;
};

const positionClasses: Record<TooltipPosition, string> = {
  top: "-translate-x-1/2 -translate-y-full mb-2 left-1/2 bottom-full",
  bottom: "-translate-x-1/2 mt-2 left-1/2 top-full",
  left: "-translate-y-1/2 -translate-x-full mr-2 top-1/2 right-full",
  right: "-translate-y-1/2 ml-2 top-1/2 left-full",
};

export function Tooltip({
  content,
  children,
  position = "top",
  delay = 0.18,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleMouseEnter() {
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay * 1000);
  }

  function handleMouseLeave() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsVisible(false);
  }

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <AnimatePresence>
        {isVisible ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`pointer-events-none absolute z-[120] whitespace-nowrap rounded-md bg-[var(--color-brand-primary)] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-white shadow-xl ${positionClasses[position]}`}
          >
            {content}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
