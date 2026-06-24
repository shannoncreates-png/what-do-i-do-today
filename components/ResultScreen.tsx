"use client";

import { GridModal } from "./GridModal";
import type { Activity } from "@/lib/activities";
import { CAT_COLOR } from "@/lib/constants";

interface ResultScreenProps {
  liked: Activity[];
  onRestart: () => void;
  onShowGrid: () => void;
  showGrid: boolean;
  onCloseGrid: () => void;
  onGroupVote: () => void;
}

export function ResultScreen({ liked, onRestart, onShowGrid, showGrid, onCloseGrid, onGroupVote }: ResultScreenProps) {
  if (showGrid) {
    return <GridModal items={liked} onClose={onCloseGrid} title="Everything you liked" />;
  }

  const winner = liked.length > 0 ? liked[liked.length - 1] : null;
  const catColor = winner ? CAT_COLOR[winner.tags[0]] || "#6366f1" : "#6366f1";

  return (
    <div style={{ minHeight: "100dvh", background: "#f7f5ff", color: "#111827" }}>
      <div className="max-w-[440px] mx-auto px-5 pt-10 pb-28 w-full">
        <div className="text-center mb-6">
          <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 6, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em" }}>Best match</div>
          {winner ? (
            <div
              style={{
                background: "white",
                borderRadius: 24,
                padding: "28px 24px",
                marginBottom: 20,
                border: `2px solid ${catColor}30`,
                boxShadow: `0 8px 32px ${catColor}15`,
              }}
            >
              <div style={{ fontSize: 72, marginBottom: 12 }}>{winner.emoji}</div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 6, letterSpacing: "-0.02em" }}>{winner.title}</h1>
              <p style={{ color: "#6b7280", marginBottom: 14, fontSize: 14 }}>{winner.desc}</p>
              <div className="flex justify-center gap-2 flex-wrap">
                {winner.tags.map((t) => (
                  <span key={t} style={{ background: `${CAT_COLOR[t] || "#f3f4f6"}20`, color: CAT_COLOR[t] || "#6b7280", fontSize: 11, padding: "3px 10px", borderRadius: 12, border: `1px solid ${CAT_COLOR[t] || "#e5e7eb"}40` }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p style={{ color: "#9ca3af" }}>You didn&apos;t like anything — go back and swipe some more!</p>
          )}
        </div>

        {liked.length > 1 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ color: "#6b7280", fontSize: 13, marginBottom: 10, textAlign: "center" }}>
              Or choose from your {liked.length} liked:
            </div>
            <div className="flex flex-wrap gap-2">
              {liked.map((a) => (
                <div key={a.id} style={{ background: "white", borderRadius: 12, padding: "8px 12px", fontSize: 13, color: "#374151", display: "flex", gap: 8, alignItems: "center", border: "1px solid #f3f4f6" }}>
                  <span style={{ fontSize: 18 }}>{a.emoji}</span>
                  <span>{a.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button style={{ width: "100%", padding: "14px", borderRadius: 16, border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 16px rgba(99,102,241,0.25)" }} onClick={onShowGrid}>
            🗂 See all {liked.length} liked
          </button>
          {liked.length > 0 && (
            <button style={{ width: "100%", padding: "14px", borderRadius: 16, border: "1.5px solid #fde68a", background: "#fffbeb", color: "#92400e", fontWeight: 600, cursor: "pointer" }} onClick={onGroupVote}>
              🗳 Vote on it as a group
            </button>
          )}
          <button style={{ width: "100%", padding: "14px", borderRadius: 16, border: "1.5px solid #e5e7eb", background: "white", color: "#374151", fontWeight: 600, cursor: "pointer" }} onClick={onRestart}>
            Start over
          </button>
        </div>
      </div>
    </div>
  );
}
