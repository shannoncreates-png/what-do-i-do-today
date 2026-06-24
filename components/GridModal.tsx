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
    <div className="fixed inset-0 bg-[#0b0818] z-50 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-5 py-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-[#f0eeff] text-xl font-bold">
            {title} ({items.length})
          </h2>
          <button
            onClick={onClose}
            style={{ background: "rgba(255,255,255,0.08)" }}
            className="text-[#9d9bc7] text-xl w-9 h-9 rounded-full border-none cursor-pointer flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center text-[#6b6997] py-16">
            <div className="text-5xl mb-3">💭</div>
            <p>Nothing liked yet — keep swiping!</p>
          </div>
        ) : (
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
            {items.map((a) => {
              const c = CAT_COLOR[a.tags[0]] || "#6366f1";
              return (
                <div
                  key={a.id}
                  style={{
                    background: "linear-gradient(160deg,#1a1635,#231d4f)",
                    borderRadius: 16,
                    padding: "16px 14px",
                    border: `1px solid ${c}33`,
                  }}
                >
                  <div className="text-3xl mb-2">{a.emoji}</div>
                  <div className="text-[#f0eeff] text-sm font-semibold mb-1">{a.title}</div>
                  <div className="text-[#6b6997] text-[11px]">{a.desc.slice(0, 60)}…</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {a.tags.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        style={{
                          fontSize: 10,
                          padding: "2px 6px",
                          borderRadius: 8,
                          background: `${CAT_COLOR[t] || "#ffffff"}15`,
                          color: CAT_COLOR[t] || "#9d9bc7",
                        }}
                      >
                        {t}
                      </span>
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
