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

  const isFirstFew = swipeCount < 3;

  return (
    <div style={{ minHeight: "100dvh", background: "#f7f5ff", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 8px", maxWidth: 440, margin: "0 auto", width: "100%" }}>
        <span style={{ fontSize: 12, color: "#a0a0c0", fontWeight: 500 }}>
          {swipeCount === 0 ? "Swipe to start learning your vibe" : `${swipeCount} swiped · ${liked.length} maybe`}
        </span>
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
          }}
        >
          ❤️ {liked.length}
        </button>
      </div>

      {/* Swipe hint — shown for the first few cards */}
      {isFirstFew && (
        <div style={{ maxWidth: 440, margin: "0 auto", padding: "0 20px 6px", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "white", borderRadius: 12, padding: "10px 14px", border: "1px solid #e9d5ff", fontSize: 12 }}>
            <span style={{ color: "#ef4444", fontWeight: 600 }}>← Nope</span>
            <span style={{ color: "#6b7280" }}>swipe or tap the buttons</span>
            <span style={{ color: "#10b981", fontWeight: 600 }}>Maybe →</span>
          </div>
        </div>
      )}

      {/* Card area */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 20px 8px" }}>
        {current ? (
          <SwipeCard activity={current} onSwipe={handleSwipe} nextCards={nextCards} />
        ) : (
          <div style={{ textAlign: "center", color: "#9ca3af" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <p>You&apos;ve seen everything!</p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div style={{ padding: "8px 20px 28px", maxWidth: 440, margin: "0 auto", width: "100%" }}>
        {/* Direction labels */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, padding: "0 4px" }}>
          <span style={{ fontSize: 11, color: "#f87171", fontWeight: 600 }}>✕ No thanks</span>
          <span style={{ fontSize: 11, color: "#6b7280" }}>
            {liked.length > 0 ? "ready to choose? ↓" : "like a few first ↓"}
          </span>
          <span style={{ fontSize: 11, color: "#34d399", fontWeight: 600 }}>Maybe ♥</span>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {/* Skip / No */}
          <button
            onClick={() => handleSwipe("left")}
            title="Nope"
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "white",
              border: "1.5px solid #fca5a5",
              color: "#ef4444",
              fontSize: 20,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(239,68,68,0.1)",
              flexShrink: 0,
            }}
          >
            ✕
          </button>

          {/* Choose button — center, most prominent */}
          <button
            onClick={onSelect}
            disabled={liked.length === 0}
            style={{
              flex: 1,
              padding: "14px 12px",
              borderRadius: 16,
              border: "none",
              background: liked.length === 0 ? "#e5e7eb" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
              color: liked.length === 0 ? "#9ca3af" : "white",
              fontSize: 14,
              fontWeight: 700,
              cursor: liked.length === 0 ? "not-allowed" : "pointer",
              transition: "all 0.15s",
              boxShadow: liked.length > 0 ? "0 4px 16px rgba(99,102,241,0.3)" : "none",
              lineHeight: 1.3,
              textAlign: "center",
            }}
          >
            {liked.length === 0
              ? "Swipe right on anything\nyou might like"
              : `Choose from ${liked.length} maybe${liked.length === 1 ? "" : "s"} ✨`}
          </button>

          {/* Like / Maybe */}
          <button
            onClick={() => handleSwipe("right")}
            title="Maybe"
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "white",
              border: "1.5px solid #6ee7b7",
              color: "#10b981",
              fontSize: 20,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(52,211,153,0.12)",
              flexShrink: 0,
            }}
          >
            ♥
          </button>
        </div>

        {/* Algorithm nudge */}
        <p style={{ textAlign: "center", fontSize: 11, color: "#c4b5fd", marginTop: 10 }}>
          {swipeCount < 5
            ? "Keep swiping — the algorithm learns as you go"
            : swipeCount < 15
            ? "Getting a feel for your vibe..."
            : "Dialled in — suggestions are personalised now"}
        </p>
      </div>
    </div>
  );
}
