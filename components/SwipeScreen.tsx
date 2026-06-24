"use client";

import { useState } from "react";
import { SwipeCard } from "./SwipeCard";
import { GridModal } from "./GridModal";
import { pickNext } from "@/lib/algorithm";
import type { Activity } from "@/lib/activities";

interface SwipeState {
  pool: Activity[];
  current: Activity | null;
  liked: Activity[];
  swipeCount: number;
  tagScores: Record<string, number>;
  dislikedTags: Record<string, number>;
  recentCategories: string[];
  seenIds: number[];
}

interface SwipeScreenProps {
  swipeState: SwipeState;
  onUpdate: (s: SwipeState) => void;
  onSelect: () => void;
  onShowGrid: () => void;
  showGrid: boolean;
  onCloseGrid: () => void;
}

export function SwipeScreen({ swipeState, onUpdate, onSelect, onShowGrid, showGrid, onCloseGrid }: SwipeScreenProps) {
  const { pool, current, liked, swipeCount, tagScores, dislikedTags, recentCategories, seenIds } = swipeState;
  const [likedTray, setLikedTray] = useState(false);

  // Build 2-card preview stack
  const nextCards: Activity[] = [];
  {
    const seenSet = new Set(Array.isArray(seenIds) ? seenIds : [...(seenIds as unknown as Set<number>)]);
    let tempCats = [...recentCategories];
    for (let i = 0; i < 2; i++) {
      const n = pickNext(pool, tagScores, dislikedTags, swipeCount + i + 1, tempCats, seenSet);
      if (n) {
        nextCards.push(n);
        seenSet.add(n.id);
        tempCats = [...tempCats, n.tags[0]].slice(-6);
      }
    }
  }

  function handleSwipe(dir: "left" | "right") {
    if (!current) return;
    const isLike = dir === "right";
    const newLiked = isLike ? [...liked, current] : liked;

    const newTagScores = { ...tagScores };
    const newDisliked = { ...dislikedTags };
    const recency = 1 + swipeCount / 10;
    for (const tag of current.tags) {
      if (isLike) {
        newTagScores[tag] = (newTagScores[tag] || 0) + recency;
      } else {
        newDisliked[tag] = (newDisliked[tag] || 0) + 0.8;
      }
    }

    const newRecentCats = [...recentCategories, current.tags[0]].slice(-8);
    const newSeenSet = new Set([...seenIds, current.id]);
    const next = pickNext(pool, newTagScores, newDisliked, swipeCount + 1, newRecentCats, newSeenSet);
    if (next) newSeenSet.add(next.id);

    onUpdate({
      ...swipeState,
      current: next,
      liked: newLiked,
      swipeCount: swipeCount + 1,
      tagScores: newTagScores,
      dislikedTags: newDisliked,
      recentCategories: newRecentCats,
      seenIds: Array.from(newSeenSet),
    });
  }

  if (showGrid) {
    return <GridModal items={liked} onClose={onCloseGrid} title="Liked so far" />;
  }

  const phase = swipeCount < 10 ? 1 : swipeCount < 20 ? 2 : 3;
  const phaseDesc =
    phase === 1
      ? "Exploring all 12 categories to understand your vibe"
      : phase === 2
      ? "Mixing variety with what you're responding to"
      : "Dialling in — serving what you love, filtering what you don't";

  return (
    <div className="min-h-screen bg-[#0b0818] text-[#f0eeff] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 max-w-[440px] mx-auto w-full">
        <div className="text-xs text-[#6b6997]">{swipeCount} swipes</div>
        <div className="text-xs text-[#6b6997]">Phase {phase}</div>
        <button
          style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 20, color: "#f0eeff", padding: "6px 14px", fontSize: 14, cursor: "pointer", fontWeight: 600 }}
          onClick={onShowGrid}
        >
          ❤️ {liked.length}
        </button>
      </div>

      {/* Algorithm hint */}
      <div className="max-w-[440px] mx-auto mt-2 px-5 w-full">
        <div
          style={{ background: "rgba(99,102,241,0.12)", borderRadius: 10, border: "1px solid rgba(99,102,241,0.2)" }}
          className="px-3 py-2 text-[11px] text-[#9d9bc7] text-center"
        >
          🤖 {phaseDesc}
        </div>
      </div>

      {/* Card area */}
      <div className="flex-1 flex items-center justify-center px-5 py-5">
        {current ? (
          <SwipeCard activity={current} onSwipe={handleSwipe} nextCards={nextCards} />
        ) : (
          <div className="text-center text-[#6b6997]">
            <div className="text-5xl mb-3">🎉</div>
            <p>You&apos;ve seen everything!</p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="px-5 pb-4 max-w-[440px] mx-auto w-full">
        <div className="flex gap-4 justify-center items-center mb-4">
          <button
            style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(239,68,68,0.15)", border: "2px solid rgba(239,68,68,0.27)", color: "#ef4444", fontSize: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => handleSwipe("left")}
            title="Skip"
          >
            ✗
          </button>

          <button
            style={{ flex: 1, padding: "14px 16px", borderRadius: 16, border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", fontSize: 14, fontWeight: 600, cursor: liked.length === 0 ? "not-allowed" : "pointer", opacity: liked.length === 0 ? 0.4 : 1 }}
            onClick={onSelect}
            disabled={liked.length === 0}
          >
            {liked.length === 0 ? "Like something first" : `Choose from ${liked.length} liked`}
          </button>

          <button
            style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(52,211,153,0.15)", border: "2px solid rgba(52,211,153,0.27)", color: "#34d399", fontSize: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => handleSwipe("right")}
            title="Like"
          >
            ♥
          </button>
        </div>

        {/* Liked tray */}
        {liked.length > 0 && (
          <div>
            <button
              style={{ background: "none", border: "none", color: "#6b6997", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, margin: "0 auto" }}
              onClick={() => setLikedTray((t) => !t)}
            >
              {likedTray ? "▲" : "▼"} {liked.length} liked so far
            </button>
            {likedTray && (
              <div className="mt-2.5 flex gap-2 flex-wrap justify-center">
                {liked.slice(-8).map((a) => (
                  <div
                    key={a.id}
                    style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "6px 10px", fontSize: 12, color: "#c4c2e8", display: "flex", gap: 6, alignItems: "center" }}
                  >
                    <span>{a.emoji}</span>
                    <span style={{ maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</span>
                  </div>
                ))}
                {liked.length > 8 && <span style={{ color: "#6b6997", fontSize: 12, alignSelf: "center" }}>+{liked.length - 8} more</span>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
