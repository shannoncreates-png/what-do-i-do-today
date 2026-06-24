interface FilterSectionProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
}

export function FilterSection({ label, hint, children }: FilterSectionProps) {
  return (
    <div className="mb-7">
      <div className="flex items-baseline gap-2 mb-2.5">
        <span className="text-[#e2e0ff] font-semibold text-xs uppercase tracking-widest">{label}</span>
        {hint && <span className="text-[#6b6997] text-[11px]">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
