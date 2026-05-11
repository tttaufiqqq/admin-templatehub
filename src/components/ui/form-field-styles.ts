import { cn } from "@/lib/utils";

export function getFormFieldClassName(baseClassName: string, hasError: boolean) {
  return cn(
    baseClassName,
    hasError
      ? "border-[#c48372] bg-[#fffaf8] focus:border-[#8f3a2f] focus:ring-[#c48372]/40"
      : null,
  );
}
