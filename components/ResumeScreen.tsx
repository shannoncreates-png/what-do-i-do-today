"use client";

import type { SessionData } from "@/lib/storage";

interface ResumeScreenProps {
  session: SessionData;
  onResume: () => void;
  onFresh: () => void;
}

export function ResumeScreen({ session, onResume, onFresh }: ResumeScreenProps) {
  const liked = session?.swipeState?.liked || [];
  const count = session?.swipeState?.swipeCount || 0;

  return (
    <div style={{ minHeight: "100dvh", background: "#f7f5ff", display: "flex", flexDirection: "column" }}>
      <div className="max-w-md mx-auto px-5 py-16 text-center flex flex-col items-center">
        <div className="text-6xl mb-5">🔮</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 8, letterSpacing: "-0.02em" }}>
          You were mid-swipe
        </h1>
        <p style={{ color: "#6b7280", marginBottom: 28 }}>
          {count} swipes in, {liked.length} liked. Pick up where you left off?
        </p>
        <button
          style={{ width: "100%", padding: "15px", borderRadius: 18, border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", fontSize: 16, fontWeight: 600, marginBottom: 10, cursor: "pointer", boxShadow: "0 4px 16px rgba(99,102,241,0.3)" }}
          onClick={onResume}
        >
          Continue session
        </button>
        <button
          style={{ width: "100%", padding: "15px", borderRadius: 18, border: "1.5px solid #e5e7eb", background: "white", color: "#374151", fontSize: 16, fontWeight: 600, cursor: "pointer" }}
          onClick={onFresh}
        >
          Start fresh
        </button>
      </div>
    </div>
  );
}
