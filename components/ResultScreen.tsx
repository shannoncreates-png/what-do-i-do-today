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
    <div className="min-h-screen bg-[#0b0818] text-[#f0eeff] flex flex-col">
      <div className="max-w-[440px] mx-auto px-5 pt-10 pb-28 w-full">
        <div className="text-center mb-8">
          <div className="text-sm text-[#6b6997] mb-2">Best match</div>
          {winner ? (
            <div
              style={{
                background: "linear-gradient(160deg,#1a1635,#231d4f)",
                borderRadius: 24,
                padding: "32px 28px",
                marginBottom: 24,
                border: `2px solid ${catColor}44`,
                boxShadow: `0 0 40px ${catColor}22`,
              }}
            >
              <div className="text-8xl mb-4">{winner.emoji}</div>
              <h1 className="text-3xl font-extrabold text-[#f0eeff] mb-2 tracking-tight">{winner.title}</h1>
              <p className="text-[#9d9bc7] mb-4">{winner.desc}</p>
              <div className="flex justify-center gap-2 flex-wrap">
                {winner.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      background: `${CAT_COLOR[t] || "#ffffff"}18`,
                      color: CAT_COLOR[t] || "#9d9bc7",
                      fontSize: 11,
                      padding: "3px 10px",
                      borderRadius: 12,
                      border: `1px solid ${CAT_COLOR[t] || "#ffffff"}33`,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-[#6b6997]">You didn&apos;t like anything — go back and swipe some more!</p>
          )}
        </div>

        {liked.length > 1 && (
          <div className="mb-6">
            <div className="text-[#9d9bc7] text-sm mb-3 text-center">Or choose from your {liked.length} liked:</div>
            <div className="flex flex-wrap gap-2">
              {liked.map((a) => (
                <div
                  key={a.id}
                  style={{ background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: "10px 14px", fontSize: 13, color: "#c4c2e8", display: "flex", gap: 8, alignItems: "center" }}
                >
                  <span className="text-xl">{a.emoji}</span>
                  <span>{a.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
            className="w-full py-4 rounded-2xl text-white font-semibold cursor-pointer"
            onClick={onShowGrid}
          >
            🗂 See all {liked.length} liked
          </button>
          {liked.length > 0 && (
            <button
              style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.3)" }}
              className="w-full py-4 rounded-2xl font-semibold cursor-pointer"
              onClick={onGroupVote}
            >
              🗳 Vote on it as a group
            </button>
          )}
          <button
            style={{ background: "rgba(255,255,255,0.06)" }}
            className="w-full py-4 rounded-2xl text-white font-semibold cursor-pointer"
            onClick={onRestart}
          >
            Start over
          </button>
        </div>
      </div>
    </div>
  );
}
