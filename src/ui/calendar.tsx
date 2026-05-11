"use client";

import { useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export type CalendarProps = {
  selectedDate?: Date;
  onSelect?: (date: Date) => void;
  className?: string;
  markers?: Record<number, unknown[]>;
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export function Calendar({
  selectedDate,
  onSelect,
  className,
  markers = {},
}: CalendarProps) {
  const [viewDate, setViewDate] = useState(selectedDate ?? new Date());
  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  function isSelected(day: number) {
    return (
      selectedDate?.getDate() === day &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear
    );
  }

  function isToday(day: number) {
    const today = new Date();

    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  }

  return (
    <div
      className={cn(
        "rounded-[24px] border border-[color:var(--color-brand-border)] bg-white p-5 shadow-[0_18px_40px_rgba(16,28,44,0.08)]",
        className,
      )}
    >
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--color-brand-primary)]">
          {MONTH_NAMES[currentMonth]} {currentYear}
        </h3>
        <div className="flex gap-1">
          <button
            className="rounded-md p-1.5 text-[var(--color-brand-primary)]/42 transition-colors hover:bg-[var(--color-brand-bg)] hover:text-[var(--color-brand-primary)]"
            onClick={() => setViewDate(new Date(currentYear, currentMonth - 1, 1))}
            type="button"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            className="rounded-md p-1.5 text-[var(--color-brand-primary)]/42 transition-colors hover:bg-[var(--color-brand-bg)] hover:text-[var(--color-brand-primary)]"
            onClick={() => setViewDate(new Date(currentYear, currentMonth + 1, 1))}
            type="button"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div
            key={day}
            className="py-2 text-center text-[8px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-primary)]/24"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="p-2" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;

          return (
            <button
              key={day}
              className={cn(
                "relative aspect-square rounded-[14px] text-[10px] font-medium transition-all",
                isSelected(day)
                  ? "bg-[var(--color-brand-primary)] text-white shadow-lg"
                  : "text-[var(--color-brand-primary)]/68 hover:bg-[var(--color-brand-bg)] hover:text-[var(--color-brand-primary)]",
                isToday(day) && !isSelected(day) && "ring-1 ring-[var(--color-brand-primary)]/35",
              )}
              onClick={() => onSelect?.(new Date(currentYear, currentMonth, day))}
              type="button"
            >
              <span>{day}</span>
              {markers[day]?.length ? (
                <span
                  className={cn(
                    "absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full",
                    isSelected(day) ? "bg-white" : "bg-[var(--color-brand-primary)]",
                  )}
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
