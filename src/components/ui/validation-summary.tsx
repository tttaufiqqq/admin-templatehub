type ValidationSummaryProps = {
  errors: string[];
};

export function ValidationSummary({ errors }: ValidationSummaryProps) {
  if (errors.length === 0) {
    return null;
  }

  return (
    <div className="rounded-[24px] border border-[#d6b1a6] bg-[#fff4ef] px-5 py-4 shadow-[0_14px_32px_rgba(143,58,47,0.08)]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#8f3a2f]">
        Review these fields
      </p>
      <ul className="mt-3 space-y-2 text-sm leading-7 text-[#8f3a2f]">
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    </div>
  );
}
