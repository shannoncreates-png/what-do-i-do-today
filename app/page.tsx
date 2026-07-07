import type { Metadata } from "next";
import Link from "next/link";
import { ALL_ACTIVITIES } from "@/lib/activities";
import { ALL_CATEGORIES, CAT_COLOR, CAT_EMOJI } from "@/lib/constants";
import { SwipeApp } from "@/components/SwipeApp";

export const metadata: Metadata = {
  title: "What do I do today? — Find Something Fun",
  description:
    "Swipe through 1,239 activity ideas across 12 categories. Find the perfect thing to do today — date night ideas, things to do with friends, outdoor adventures, creative projects, and more.",
  alternates: {
    canonical: "https://what-do-i-do-today.vercel.app",
  },
};

// Server-rendered — fully visible to Googlebot
function BrowseSection() {
  const samples = ALL_ACTIVITIES.slice(0, 18);

  return (
    <section
      aria-label="Browse activity ideas"
      style={{
        background: "#f0eeff",
        borderTop: "1px solid #e9d5ff",
        padding: "56px 20px 64px",
      }}
    >
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#111827",
              marginBottom: 10,
              letterSpacing: "-0.02em",
            }}
          >
            {ALL_ACTIVITIES.length} things to do today
          </h2>
          <p style={{ color: "#6b7280", fontSize: 15, lineHeight: 1.7, maxWidth: 480, margin: "0 auto" }}>
            Browse activity ideas across {ALL_CATEGORIES.length} categories — outdoors, food, social,
            culture, creative, wellness, adventure, sports, lifestyle, crafts, gaming, and nightlife.
          </p>
        </div>

        {/* Category links */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            justifyContent: "center",
            marginBottom: 36,
          }}
        >
          {ALL_CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/categories/${c}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "9px 16px",
                borderRadius: 20,
                background: "white",
                border: `1.5px solid ${CAT_COLOR[c] || "#e5e7eb"}35`,
                color: "#374151",
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}
            >
              {CAT_EMOJI[c]} {c.charAt(0).toUpperCase() + c.slice(1)}
            </Link>
          ))}
        </div>

        {/* Sample activity grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 14,
            marginBottom: 36,
          }}
        >
          {samples.map((a) => {
            const c = CAT_COLOR[a.tags[0]] || "#6366f1";
            return (
              <div
                key={a.id}
                style={{
                  background: "white",
                  borderRadius: 14,
                  padding: "14px 12px",
                  border: `1.5px solid ${c}20`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 6 }}>{a.emoji}</div>
                <div style={{ fontWeight: 700, color: "#111827", fontSize: 13, marginBottom: 3 }}>
                  {a.title}
                </div>
                <div style={{ color: "#9ca3af", fontSize: 11, lineHeight: 1.5 }}>{a.desc}</div>
              </div>
            );
          })}
        </div>

        <p style={{ textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
          Showing 18 of {ALL_ACTIVITIES.length} activities.{" "}
          <Link href="/" style={{ color: "#6366f1", fontWeight: 600, textDecoration: "none" }}>
            Use the swipe finder to discover them all →
          </Link>
        </p>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <SwipeApp />
      <BrowseSection />
    </>
  );
}
