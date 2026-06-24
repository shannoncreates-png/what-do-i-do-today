interface FilterSectionProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
}

export function FilterSection({ label, hint, children }: FilterSectionProps) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 10 }}>
        <span style={{ color: "#374151", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</span>
        {hint && <span style={{ color: "#9ca3af", fontSize: 11 }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}
