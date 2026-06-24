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
    <div className="min-h-screen bg-[#0b0818] text-[#f0eeff] flex flex-col">
      <div className="max-w-md mx-auto px-5 py-16 text-center flex flex-col items-center">
        <div className="text-6xl mb-5">🔮</div>
        <h1 className="text-3xl font-extrabold text-[#f0eeff] mb-3 tracking-tight">You were mid-swipe</h1>
        <p className="text-[#9d9bc7] mb-8">
          {count} swipes in, {liked.length} liked. Pick up where you left off?
        </p>
        <button
          className="w-full py-4 rounded-2xl font-semibold text-base text-white mb-3 cursor-pointer"
          style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
          onClick={onResume}
        >
          Continue session
        </button>
        <button
          className="w-full py-4 rounded-2xl font-semibold text-base text-white cursor-pointer"
          style={{ background: "rgba(255,255,255,0.07)" }}
          onClick={onFresh}
        >
          Start fresh
        </button>
      </div>
    </div>
  );
}
