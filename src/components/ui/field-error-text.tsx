type FieldErrorTextProps = {
  message?: string | null;
  hint?: string | null;
};

export function FieldErrorText({ message, hint }: FieldErrorTextProps) {
  if (message) {
    return (
      <span className="rounded-full bg-[#fff4ef] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8f3a2f]">
        {message}
      </span>
    );
  }

  if (hint) {
    return (
      <span className="text-sm text-[var(--color-brand-primary)]/55">{hint}</span>
    );
  }

  return null;
}
