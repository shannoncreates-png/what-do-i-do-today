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
  const velocityRef = useRef<{ x: number; lastX: number; lastT: number }>({ x: 0, lastX: 0, lastT: 0 });

  const doSwipe = useCallback(
    (dir: "left" | "right") => {
      setAnimDir(dir);
      setTimeout(() => {
        onSwipe(dir);
        setDrag({ x: 0, y: 0, dragging: false });
        setAnimDir(null);
      }, 250);
    },
    [onSwipe]
  );

  function onPointerDown(e: React.PointerEvent) {
    startRef.current = { x: e.clientX, y: e.clientY };
    velocityRef.current = { x: 0, lastX: e.clientX, lastT: Date.now() };
    setDrag((d) => ({ ...d, dragging: true }));
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!drag.dragging || !startRef.current) return;
    const now = Date.now();
    const dt = now - velocityRef.current.lastT;
    if (dt > 0) {
      velocityRef.current.x = (e.clientX - velocityRef.current.lastX) / dt;
      velocityRef.current.lastX = e.clientX;
      velocityRef.current.lastT = now;
    }
    setDrag({ x: e.clientX - startRef.current.x, y: e.clientY - startRef.current.y, dragging: true });
  }

  function onPointerUp() {
    if (!drag.dragging) return;
    const velocity = velocityRef.current.x;
    const absDrag = Math.abs(drag.x);
    // Velocity-based flick: fast flick (>0.5px/ms) counts even with small drag
    if (absDrag > 80 || Math.abs(velocity) > 0.5) {
      doSwipe(drag.x > 0 || velocity > 0 ? "right" : "left");
    } else {
      setDrag({ x: 0, y: 0, dragging: false });
    }
  }

  const cardRotation = drag.x * 0.08;
  const cardColor =
    drag.x > 30
      ? `rgba(52,211,153,${Math.min(drag.x / 120, 0.5)})`
      : drag.x < -30
      ? `rgba(239,68,68,${Math.min(-drag.x / 120, 0.5)})`
      : "transparent";

  const primaryCat = activity.tags[0];
  const catColor = CAT_COLOR[primaryCat] || "#6366f1";

  let transform = `translateX(${drag.x}px) translateY(${drag.y * 0.3}px) rotate(${cardRotation}deg)`;
  let transition = drag.dragging ? "none" : "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)";
  if (animDir === "right") {
    transform = "translateX(200%) rotate(20deg)";
    transition = "transform 0.25s ease-in";
  } else if (animDir === "left") {
    transform = "translateX(-200%) rotate(-20deg)";
    transition = "transform 0.25s ease-in";
  }

  return (
    <div className="relative flex items-center justify-center w-full" style={{ minHeight: 460 }}>
      {/* Ghost cards */}
      {nextCards
        .slice()
        .reverse()
        .map((card, i) => {
          const offset = (nextCards.length - i) * 10;
          const scale = 1 - (nextCards.length - i) * 0.05;
          return (
            <div
              key={card.id}
              style={{
                position: "absolute",
                width: "100%",
                maxWidth: 360,
                transform: `translateY(${offset}px) scale(${scale})`,
                zIndex: i,
                borderRadius: 24,
                height: 480,
                background: "linear-gradient(160deg,#1a1635,#231d4f)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                opacity: 0.6,
              }}
            />
          );
        })}

      {/* Main card */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 360,
          zIndex: 10,
          borderRadius: 24,
          overflow: "hidden",
          background: "linear-gradient(160deg,#1a1635,#231d4f)",
          boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px ${catColor}33`,
          transform,
          transition,
          cursor: drag.dragging ? "grabbing" : "grab",
          userSelect: "none",
          touchAction: "none",
          minHeight: 460,
        }}
      >
        {/* Entrance animation */}
        <style>{`
          @keyframes cardIn {
            from { opacity: 0; transform: scale(0.92) translateY(16px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>

        {/* Color wash overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            borderRadius: 24,
            background: cardColor,
            transition: drag.dragging ? "none" : "background 0.2s",
            pointerEvents: "none",
          }}
        />

        {/* YES / NOPE labels */}
        {drag.x > 30 && (
          <div
            style={{
              position: "absolute",
              top: 28,
              left: 24,
              zIndex: 5,
              background: "rgba(52,211,153,0.2)",
              border: "2px solid #34d399",
              borderRadius: 8,
              padding: "4px 12px",
              transform: "rotate(-12deg)",
              fontSize: 22,
              fontWeight: 800,
              color: "#34d399",
              letterSpacing: 2,
            }}
          >
            YES
          </div>
        )}
        {drag.x < -30 && (
          <div
            style={{
              position: "absolute",
              top: 28,
              right: 24,
              zIndex: 5,
              background: "rgba(239,68,68,0.2)",
              border: "2px solid #ef4444",
              borderRadius: 8,
              padding: "4px 12px",
              transform: "rotate(12deg)",
              fontSize: 22,
              fontWeight: 800,
              color: "#ef4444",
              letterSpacing: 2,
            }}
          >
            NOPE
          </div>
        )}

        {/* Card content */}
        <div style={{ padding: "32px 28px 28px", position: "relative", zIndex: 3 }}>
          {/* Category badge */}
          <div className="flex justify-between items-center mb-6">
            <span
              style={{
                background: `${catColor}22`,
                color: catColor,
                fontSize: 11,
                fontWeight: 600,
                padding: "4px 10px",
                borderRadius: 20,
                border: `1px solid ${catColor}44`,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {CAT_EMOJI[primaryCat]} {primaryCat}
            </span>
            <span className="text-[#4b4a6e] text-xs">{EFFORT_LABEL[activity.effort]}</span>
          </div>

          {/* Emoji */}
          <div className="text-7xl leading-none mb-5" style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))" }}>
            {activity.emoji}
          </div>

          {/* Title */}
          <h2 className="text-3xl font-extrabold text-[#f0eeff] mb-2.5 leading-tight tracking-tight">
            {activity.title}
          </h2>

          {/* Description */}
          <p className="text-[#9d9bc7] text-[15px] leading-relaxed mb-6">{activity.desc}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {activity.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  background: `${CAT_COLOR[tag] || "rgba(255,255,255,0.1)"}18`,
                  color: CAT_COLOR[tag] || "#9d9bc7",
                  fontSize: 11,
                  padding: "3px 8px",
                  borderRadius: 12,
                  border: `1px solid ${CAT_COLOR[tag] || "rgba(255,255,255,0.1)"}33`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Meta */}
          <div className="flex gap-3 flex-wrap">
            <span
              style={{
                fontSize: 11,
                color: "#6b6997",
                background: "rgba(255,255,255,0.05)",
                padding: "4px 8px",
                borderRadius: 8,
              }}
            >
              💰 {BUDGET_LABEL[activity.budget]}
            </span>
            <span
              style={{
                fontSize: 11,
                color: "#6b6997",
                background: "rgba(255,255,255,0.05)",
                padding: "4px 8px",
                borderRadius: 8,
              }}
            >
              {activity.solo && activity.date
                ? "👤👫 Solo or together"
                : activity.solo
                ? "👤 Solo"
                : "👫 Better together"}
            </span>
          </div>
        </div>
      </div>

      {/* Tap-to-swipe buttons (invisible overlay, accessible) */}
      <button
        aria-label="Skip"
        style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "30%", opacity: 0, zIndex: 20 }}
        onClick={() => doSwipe("left")}
      />
      <button
        aria-label="Like"
        style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "30%", opacity: 0, zIndex: 20 }}
        onClick={() => doSwipe("right")}
      />
    </div>
  );
}
