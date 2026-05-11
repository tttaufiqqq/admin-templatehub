import type { ReactNode } from "react";

import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type StatusTone = "error" | "success" | "warning" | "info";

type StatusCardProps = {
  title?: string;
  message: string;
  tone?: StatusTone;
  children?: ReactNode;
  className?: string;
};

const toneConfig: Record<
  StatusTone,
  {
    container: string;
    iconSurface: string;
    label: string;
    Icon: typeof Info;
  }
> = {
  error: {
    container: "border-[#d6b1a6] bg-[#fff4ef] text-[#8f3a2f]",
    iconSurface: "bg-[#f8d9cf] text-[#8f3a2f]",
    label: "Needs attention",
    Icon: AlertCircle,
  },
  success: {
    container: "border-[#b9d9c7] bg-[#f2fbf5] text-[#245a3f]",
    iconSurface: "bg-[#d9efe2] text-[#245a3f]",
    label: "Success",
    Icon: CheckCircle2,
  },
  warning: {
    container: "border-[#ddc79d] bg-[#fff9ee] text-[#7f6132]",
    iconSurface: "bg-[#f1e4c4] text-[#7f6132]",
    label: "Heads up",
    Icon: TriangleAlert,
  },
  info: {
    container:
      "border-[color:var(--color-brand-border)] bg-[var(--color-brand-muted)] text-[var(--color-brand-primary)]",
    iconSurface:
      "bg-[var(--color-brand-surface)] text-[var(--color-brand-primary)]",
    label: "Status",
    Icon: Info,
  },
};

export function StatusCard({
  title,
  message,
  tone = "info",
  children,
  className,
}: StatusCardProps) {
  const config = toneConfig[tone];
  const Icon = config.Icon;

  return (
    <div
      className={cn(
        "rounded-[24px] border p-4 shadow-[0_14px_32px_rgba(16,28,44,0.06)] sm:p-5",
        config.container,
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <span
          className={cn(
            "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
            config.iconSurface,
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.26em] opacity-80">
            {title ?? config.label}
          </p>
          <p className="mt-2 text-sm leading-7">{message}</p>
          {children ? <div className="mt-4">{children}</div> : null}
        </div>
      </div>
    </div>
  );
}
