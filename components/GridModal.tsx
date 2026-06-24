"use client";

import type { Activity } from "@/lib/activities";
import { CAT_COLOR } from "@/lib/constants";

interface GridModalProps {
  items: Activity[];
  onClose: () => void;
  title: string;
}

export function GridModal({ items, onClose, title }: GridModalProps) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#f7f5ff", zIndex: 50, overflowY: "auto" }}>
      <div className="max-w-2xl mx-auto px-5 py-5">
        <div className="flex justify-between items-center mb-5">
          <h2 style={{ color: "#111827", fontSize: 18, fontWeight: 700 }}>
            {title} ({items.length})
          </h2>
          <button
            onClick={onClose}
            style={{ background: "white", border: "1.5px solid #e5e7eb", color: "#374151", fontSize: 16, width: 36, height: 36, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16" style={{ color: "#9ca3af" }}>
            <div className="text-5xl mb-3">💭</div>
            <p>Nothing liked yet — keep swiping!</p>
          </div>
        ) : (
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
            {items.map((a) => {
              const c = CAT_COLOR[a.tags[0]] || "#6366f1";
              return (
                <div key={a.id} style={{ background: "white", borderRadius: 16, padding: "14px 12px", border: `1px solid ${c}25`, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{a.emoji}</div>
                  <div style={{ color: "#111827", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{a.title}</div>
                  <div style={{ color: "#9ca3af", fontSize: 11 }}>{a.desc.slice(0, 60)}…</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {a.tags.slice(0, 2).map((t) => (
                      <span key={t} style={{ fontSize: 10, padding: "2px 6px", borderRadius: 8, background: `${CAT_COLOR[t] || "#f3f4f6"}18`, color: CAT_COLOR[t] || "#9ca3af", fontWeight: 500 }}>{t}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
