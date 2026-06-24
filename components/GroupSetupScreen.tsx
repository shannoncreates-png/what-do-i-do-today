"use client";

import { useState } from "react";
import type { Activity } from "@/lib/activities";

interface GroupSetupScreenProps {
  liked: Activity[];
  onBack: () => void;
}

export function GroupSetupScreen({ liked, onBack }: GroupSetupScreenProps) {
  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(false);
  const [voteUrl, setVoteUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function createVoteSession() {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/vote-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityIds: liked.map((a) => a.id) }),
      });
      if (!res.ok) throw new Error("Failed to create session");
      const { id } = await res.json();
      const url = `${window.location.origin}/vote/${id}`;
      setVoteUrl(url);
    } catch {
      setError("Couldn't create vote session. Try again.");
    } finally {
      setCreating(false);
    }
  }

  function copyLink() {
    if (!voteUrl) return;
    navigator.clipboard.writeText(voteUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="min-h-screen bg-[#0b0818] text-[#f0eeff] flex flex-col">
      <div className="max-w-[440px] mx-auto px-5 pt-10 pb-10 w-full">
        <button
          style={{ background: "none", border: "none", color: "#9d9bc7", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🗳️</div>
          <h1 className="text-3xl font-extrabold text-[#f0eeff] mb-2 tracking-tight">Group vote</h1>
          <p className="text-[#9d9bc7]">
            Share a link. Everyone votes on your {liked.length} liked activities.
          </p>
        </div>

        {!voteUrl ? (
          <button
            style={{ background: creating ? "rgba(99,102,241,0.3)" : "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
            className="w-full py-4 rounded-2xl text-white font-semibold cursor-pointer mb-4"
            onClick={createVoteSession}
            disabled={creating}
          >
            {creating ? "Creating..." : "Create vote link"}
          </button>
        ) : (
          <>
            <div
              style={{ background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: 16, marginBottom: 16, wordBreak: "break-all", fontSize: 12, color: "#6b6997", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              {voteUrl}
            </div>
            <button
              style={{ background: copied ? "rgba(52,211,153,0.2)" : "linear-gradient(135deg,#6366f1,#8b5cf6)", color: copied ? "#34d399" : "white", border: copied ? "1px solid #34d39966" : "none" }}
              className="w-full py-4 rounded-2xl font-semibold cursor-pointer"
              onClick={copyLink}
            >
              {copied ? "✓ Copied!" : "Copy vote link"}
            </button>
          </>
        )}

        {error && <p className="text-red-400 text-sm text-center mt-3">{error}</p>}

        <div className="mt-8">
          <h3 className="text-[#c4c2e8] text-sm font-semibold mb-3">Activities in the vote:</h3>
          <div className="flex flex-col gap-2">
            {liked.map((a) => (
              <div
                key={a.id}
                style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "12px 14px", display: "flex", gap: 12, alignItems: "center" }}
              >
                <span className="text-2xl">{a.emoji}</span>
                <div>
                  <div className="text-[#f0eeff] text-sm font-semibold">{a.title}</div>
                  <div className="text-[#6b6997] text-[11px]">{a.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
