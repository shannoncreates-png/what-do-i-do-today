"use client";

import { useState } from "react";
import type { Activity } from "@/lib/activities";
import { CAT_COLOR } from "@/lib/constants";

interface GroupVotePageProps {
  sessionId: string;
  activities: Activity[];
  initialVotes: Record<string, number>;
  initialVoterCount: number;
}

export function GroupVotePage({ sessionId, activities, initialVotes, initialVoterCount }: GroupVotePageProps) {
  const [votes, setVotes] = useState<Record<number, boolean>>({});
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [tally, setTally] = useState<Record<string, number>>(initialVotes);
  const [voterCount, setVoterCount] = useState(initialVoterCount);
  const [submitting, setSubmitting] = useState(false);

  function toggle(id: number) {
    setVotes((v) => ({ ...v, [id]: !v[id] }));
  }

  async function submit() {
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/vote-sessions/${sessionId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), votes }),
      });
      if (res.ok) {
        const data = await res.json();
        setTally(data.tally);
        setVoterCount(data.voterCount);
        setSubmitted(true);
      }
    } finally {
      setSubmitting(false);
    }
  }

  const sorted = [...activities].sort((a, b) => (tally[b.id] || 0) - (tally[a.id] || 0));
  const max = Math.max(...sorted.map((a) => tally[a.id] || 0), 1);

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0b0818] text-[#f0eeff] flex flex-col">
        <div className="max-w-[440px] mx-auto px-5 py-10 w-full">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">✅</div>
            <h1 className="text-3xl font-extrabold text-[#f0eeff] mb-2 tracking-tight">
              Vote recorded, {name}!
            </h1>
            <p className="text-[#9d9bc7]">
              Here&apos;s how {voterCount} vote{voterCount !== 1 ? "s" : ""} are looking:
            </p>
          </div>
          <VoteTally sorted={sorted} tally={tally} voterCount={voterCount} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0818] text-[#f0eeff] flex flex-col">
      <div className="max-w-[440px] mx-auto px-5 pt-10 pb-28 w-full">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🗳️</div>
          <h1 className="text-3xl font-extrabold text-[#f0eeff] mb-2 tracking-tight">Vote on what to do</h1>
          <p className="text-[#9d9bc7]">Tap everything you&apos;d be up for. Everyone votes, then we count.</p>
        </div>

        {voterCount > 0 && (
          <div
            style={{ background: "rgba(99,102,241,0.1)", borderRadius: 12, border: "1px solid rgba(99,102,241,0.2)" }}
            className="px-4 py-3 mb-5 text-sm text-[#9d9bc7]"
          >
            {voterCount} person{voterCount !== 1 ? "s" : ""} voted so far
          </div>
        )}

        <div className="mb-6">
          <label className="text-[#9d9bc7] text-sm block mb-2">Your name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sam"
            style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "12px 14px", color: "#f0eeff", fontSize: 15, boxSizing: "border-box" }}
          />
        </div>

        <div className="flex flex-col gap-2.5 mb-6">
          {activities.map((a) => {
            const c = CAT_COLOR[a.tags[0]] || "#6366f1";
            const selected = !!votes[a.id];
            return (
              <button
                key={a.id}
                onClick={() => toggle(a.id)}
                style={{
                  background: selected ? `${c}18` : "rgba(255,255,255,0.04)",
                  border: `2px solid ${selected ? c : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 16,
                  padding: "14px 16px",
                  cursor: "pointer",
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  textAlign: "left",
                  transition: "all 0.15s",
                }}
              >
                <span className="text-3xl">{a.emoji}</span>
                <div className="flex-1">
                  <div className="text-[#f0eeff] font-semibold text-[15px]">{a.title}</div>
                  <div className="text-[#6b6997] text-xs">{a.desc}</div>
                </div>
                <span style={{ fontSize: 20, color: selected ? c : "#4b4a6e" }}>{selected ? "✓" : "○"}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fixed submit bar */}
      <div
        className="fixed bottom-0 left-0 right-0 px-5 py-4"
        style={{ background: "linear-gradient(to top, #0b0818 70%, transparent)" }}
      >
        <button
          style={{
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            maxWidth: 440,
            margin: "0 auto",
            display: "block",
            width: "100%",
            padding: 16,
            borderRadius: 16,
            border: "none",
            color: "white",
            fontSize: 16,
            fontWeight: 600,
            cursor: name.trim() && !submitting ? "pointer" : "not-allowed",
            opacity: name.trim() && !submitting ? 1 : 0.4,
          }}
          onClick={submit}
          disabled={!name.trim() || submitting}
        >
          {submitting ? "Submitting..." : "Submit vote"}
        </button>
      </div>
    </div>
  );
}

function VoteTally({ sorted, tally, voterCount }: { sorted: Activity[]; tally: Record<string, number>; voterCount: number }) {
  const max = Math.max(...sorted.map((a) => tally[a.id] || 0), 1);
  return (
    <div className="flex flex-col gap-2.5">
      {sorted.map((a) => {
        const v = tally[a.id] || 0;
        const c = CAT_COLOR[a.tags[0]] || "#6366f1";
        const pct = (v / max) * 100;
        return (
          <div key={a.id} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: "14px 16px" }}>
            <div className="flex justify-between items-center mb-2">
              <div className="flex gap-2.5 items-center">
                <span className="text-2xl">{a.emoji}</span>
                <span className="text-[#f0eeff] font-semibold text-sm">{a.title}</span>
              </div>
              <span style={{ color: c, fontWeight: 700, fontSize: 16 }}>{v}</span>
            </div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: c, borderRadius: 3, transition: "width 0.5s" }} />
            </div>
          </div>
        );
      })}
      <div className="text-[#6b6997] text-xs text-center mt-2">{voterCount} vote{voterCount !== 1 ? "s" : ""} cast</div>
    </div>
  );
}
