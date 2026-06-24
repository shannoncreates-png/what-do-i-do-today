"use client";

interface ChipProps {
  active: boolean;
  color?: string;
  onClick: () => void;
  children: React.ReactNode;
}

export function Chip({ active, color, onClick, children }: ChipProps) {
  const c = color || "#6366f1";
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 14px",
        borderRadius: 20,
        border: `1.5px solid ${active ? c : "rgba(255,255,255,0.12)"}`,
        background: active ? `${c}22` : "rgba(255,255,255,0.04)",
        color: active ? c : "#9d9bc7",
        fontSize: 13,
        cursor: "pointer",
        fontWeight: active ? 600 : 400,
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}
