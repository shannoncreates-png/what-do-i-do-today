"use client";

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

  return (
    // h-dvh prevents scroll; overflow-hidden clips ghost cards
    <div
      className="flex flex-col overflow-hidden"
      style={{ height: "100dvh", background: "#f7f5ff" }}
    >
      {/* Header — compact */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2 max-w-[440px] mx-auto w-full flex-shrink-0">
        <span style={{ fontSize: 12, color: "#a0a0c0", fontWeight: 500 }}>{swipeCount} swipes · phase {phase}</span>
        <button
          onClick={onShowGrid}
          style={{
            background: liked.length > 0 ? "#ede9fe" : "#f3f4f6",
            border: "none",
            borderRadius: 20,
            color: liked.length > 0 ? "#7c3aed" : "#9ca3af",
            padding: "6px 14px",
            fontSize: 13,
            cursor: "pointer",
            fontWeight: 600,
            transition: "all 0.15s",
          }}
        >
          ❤️ {liked.length}
        </button>
      </div>

      {/* Card area — flex-1 centers the card */}
      <div className="flex-1 flex items-center justify-center px-5 min-h-0">
        {current ? (
          <SwipeCard activity={current} onSwipe={handleSwipe} nextCards={nextCards} />
        ) : (
          <div className="text-center" style={{ color: "#9ca3af" }}>
            <div className="text-5xl mb-3">🎉</div>
            <p>You&apos;ve seen everything!</p>
          </div>
        )}
      </div>

      {/* Action buttons — fixed at bottom, no scroll needed */}
      <div className="flex-shrink-0 px-5 pb-6 pt-3 max-w-[440px] mx-auto w-full">
        <div className="flex gap-3 items-center">
          {/* Skip */}
          <button
            onClick={() => handleSwipe("left")}
            title="Skip"
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "white",
              border: "1.5px solid #fca5a5",
              color: "#ef4444",
              fontSize: 22,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(239,68,68,0.12)",
              flexShrink: 0,
            }}
          >
            ✕
          </button>

          {/* Choose */}
          <button
            onClick={onSelect}
            disabled={liked.length === 0}
            style={{
              flex: 1,
              padding: "13px 16px",
              borderRadius: 16,
              border: "none",
              background: liked.length === 0 ? "#e5e7eb" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
              color: liked.length === 0 ? "#9ca3af" : "white",
              fontSize: 14,
              fontWeight: 600,
              cursor: liked.length === 0 ? "not-allowed" : "pointer",
              transition: "all 0.15s",
              boxShadow: liked.length > 0 ? "0 4px 16px rgba(99,102,241,0.3)" : "none",
            }}
          >
            {liked.length === 0 ? "Like something first" : `Choose from ${liked.length} liked ✨`}
          </button>

          {/* Like */}
          <button
            onClick={() => handleSwipe("right")}
            title="Like"
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "white",
              border: "1.5px solid #6ee7b7",
              color: "#10b981",
              fontSize: 22,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(52,211,153,0.15)",
              flexShrink: 0,
            }}
          >
            ♥
          </button>
        </div>
      </div>
    </div>
  );
}
