"use client";

import { useRef, useState, useCallback } from "react";
import type { Activity } from "@/lib/activities";
import { CAT_COLOR, CAT_EMOJI, BUDGET_LABEL, EFFORT_LABEL } from "@/lib/constants";

interface SwipeCardProps {
  activity: Activity;
  onSwipe: (dir: "left" | "right") => void;
  nextCards: Activity[];
}

export function SwipeCard({ activity, onSwipe, nextCards }: SwipeCardProps) {
  const [drag, setDrag] = useState({ x: 0, y: 0, dragging: false });
  const [animDir, setAnimDir] = useState<"left" | "right" | null>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const dragRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef<{ x: number; lastX: number; lastT: number }>({ x: 0, lastX: 0, lastT: 0 });

  const doSwipe = useCallback(
    (dir: "left" | "right") => {
      setAnimDir(dir);
      setTimeout(() => {
        onSwipe(dir);
        setDrag({ x: 0, y: 0, dragging: false });
        dragRef.current = { x: 0, y: 0 };
        setAnimDir(null);
      }, 220);
    },
    [onSwipe]
  );

  function onPointerDown(e: React.PointerEvent) {
    // Capture so drag continues even when pointer leaves the element
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    startRef.current = { x: e.clientX, y: e.clientY };
    velocityRef.current = { x: 0, lastX: e.clientX, lastT: Date.now() };
    setDrag({ x: 0, y: 0, dragging: true });
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!startRef.current) return;
    const now = Date.now();
    const dt = now - velocityRef.current.lastT;
    if (dt > 0) {
      velocityRef.current.x = (e.clientX - velocityRef.current.lastX) / dt;
      velocityRef.current.lastX = e.clientX;
      velocityRef.current.lastT = now;
    }
    const x = e.clientX - startRef.current.x;
    const y = e.clientY - startRef.current.y;
    dragRef.current = { x, y };
    setDrag({ x, y, dragging: true });
  }

  function onPointerUp() {
    if (!startRef.current) return;
    startRef.current = null;
    const { x } = dragRef.current;
    const velocity = velocityRef.current.x;
    const absDrag = Math.abs(x);
    if (absDrag > 80 || Math.abs(velocity) > 0.4) {
      doSwipe(x > 0 || velocity > 0.4 ? "right" : "left");
    } else {
      setDrag({ x: 0, y: 0, dragging: false });
      dragRef.current = { x: 0, y: 0 };
    }
  }

  const cardRotation = drag.x * 0.07;
  const likeFrac = Math.min(Math.abs(drag.x) / 100, 1);
  const isRight = drag.x > 20;
  const isLeft = drag.x < -20;
  const cardOverlay = isRight
    ? `rgba(52,211,153,${likeFrac * 0.45})`
    : isLeft
    ? `rgba(239,68,68,${likeFrac * 0.45})`
    : "transparent";

  const primaryCat = activity.tags[0];
  const catColor = CAT_COLOR[primaryCat] || "#6366f1";

  let transform = `translateX(${drag.x}px) translateY(${drag.y * 0.25}px) rotate(${cardRotation}deg)`;
  let transition = drag.dragging ? "none" : "transform 0.28s ease-out";
  if (animDir === "right") {
    transform = "translateX(130vw) rotate(22deg)";
    transition = "transform 0.22s ease-in";
  } else if (animDir === "left") {
    transform = "translateX(-130vw) rotate(-22deg)";
    transition = "transform 0.22s ease-in";
  }

  return (
    <div className="relative w-full" style={{ maxWidth: 380 }}>
      {/* Ghost cards behind */}
      {nextCards
        .slice()
        .reverse()
        .map((card, i) => {
          const idx = nextCards.length - i;
          return (
            <div
              key={card.id}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 24,
                background: "white",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                transform: `translateY(${idx * 8}px) scale(${1 - idx * 0.04})`,
                zIndex: i,
                opacity: 1 - idx * 0.15,
              }}
            />
          );
        })}

      {/* Main swipeable card */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          position: "relative",
          zIndex: 10,
          borderRadius: 24,
          overflow: "hidden",
          background: "white",
          boxShadow: drag.dragging
            ? "0 24px 64px rgba(0,0,0,0.18)"
            : "0 8px 32px rgba(0,0,0,0.1)",
          border: `1.5px solid ${catColor}28`,
          transform,
          transition,
          cursor: drag.dragging ? "grabbing" : "grab",
          userSelect: "none",
          touchAction: "none",
          willChange: "transform",
        }}
      >
        {/* Color wash */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            background: cardOverlay,
            pointerEvents: "none",
            borderRadius: 24,
          }}
        />

        {/* YES / NOPE stamps */}
        {isRight && (
          <div
            style={{
              position: "absolute",
              top: 24,
              left: 20,
              zIndex: 5,
              background: "rgba(52,211,153,0.15)",
              border: "2.5px solid #34d399",
              borderRadius: 8,
              padding: "3px 10px",
              transform: "rotate(-14deg)",
              fontSize: 18,
              fontWeight: 800,
              color: "#059669",
              letterSpacing: 2,
              opacity: likeFrac,
            }}
          >
            YES
          </div>
        )}
        {isLeft && (
          <div
            style={{
              position: "absolute",
              top: 24,
              right: 20,
              zIndex: 5,
              background: "rgba(239,68,68,0.12)",
              border: "2.5px solid #ef4444",
              borderRadius: 8,
              padding: "3px 10px",
              transform: "rotate(14deg)",
              fontSize: 18,
              fontWeight: 800,
              color: "#dc2626",
              letterSpacing: 2,
              opacity: likeFrac,
            }}
          >
            NOPE
          </div>
        )}

        {/* Card content */}
        <div style={{ padding: "24px 24px 20px", position: "relative", zIndex: 3 }}>
          {/* Category + effort row */}
          <div className="flex justify-between items-center mb-4">
            <span
              style={{
                background: `${catColor}18`,
                color: catColor,
                fontSize: 11,
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: 20,
                border: `1px solid ${catColor}30`,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
              }}
            >
              {CAT_EMOJI[primaryCat]} {primaryCat}
            </span>
            <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>{EFFORT_LABEL[activity.effort]}</span>
          </div>

          {/* Emoji */}
          <div className="text-6xl leading-none mb-3">{activity.emoji}</div>

          {/* Title */}
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 6, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
            {activity.title}
          </h2>

          {/* Description */}
          <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.55, marginBottom: 16 }}>{activity.desc}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {activity.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  background: `${CAT_COLOR[tag] || "#f3f4f6"}20`,
                  color: CAT_COLOR[tag] || "#6b7280",
                  fontSize: 11,
                  padding: "3px 8px",
                  borderRadius: 10,
                  border: `1px solid ${CAT_COLOR[tag] || "#e5e7eb"}40`,
                  fontWeight: 500,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Meta */}
          <div className="flex gap-2 flex-wrap">
            <span style={{ fontSize: 11, color: "#9ca3af", background: "#f9fafb", padding: "4px 8px", borderRadius: 8, border: "1px solid #f3f4f6" }}>
              💰 {BUDGET_LABEL[activity.budget]}
            </span>
            <span style={{ fontSize: 11, color: "#9ca3af", background: "#f9fafb", padding: "4px 8px", borderRadius: 8, border: "1px solid #f3f4f6" }}>
              {activity.solo && activity.date ? "👤👫 Solo or together" : activity.solo ? "👤 Solo" : "👫 Together"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
