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
        padding: "7px 13px",
        borderRadius: 20,
        border: `1.5px solid ${active ? c : "#e5e7eb"}`,
        background: active ? `${c}15` : "white",
        color: active ? c : "#6b7280",
        fontSize: 13,
        cursor: "pointer",
        fontWeight: active ? 600 : 400,
        transition: "all 0.12s",
        boxShadow: active ? `0 2px 8px ${c}20` : "none",
      }}
    >
      {children}
    </button>
  );
}
