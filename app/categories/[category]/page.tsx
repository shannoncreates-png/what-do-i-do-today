import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ALL_ACTIVITIES } from "@/lib/activities";
import { ALL_CATEGORIES, CAT_COLOR, CAT_EMOJI } from "@/lib/constants";

// Category-specific copy for rich metadata
const CAT_META: Record<string, { headline: string; description: string }> = {
  outdoors: {
    headline: "Outdoor Activities",
    description:
      "Explore 100+ outdoor activity ideas — hiking trails, camping trips, kayaking, cycling, wild swimming, nature photography, and more. Free and budget-friendly ideas for any weather.",
  },
  food: {
    headline: "Food & Drink Activities",
    description:
      "Discover food experiences worth doing today — cooking new recipes, visiting food markets, restaurant hopping, trying new cuisines, hosting dinner parties, and more.",
  },
  social: {
    headline: "Social Activities with Friends",
    description:
      "Fun things to do with friends when you're bored — game nights, themed parties, trivia, karaoke, group outings, potlucks, and more social activity ideas.",
  },
  culture: {
    headline: "Culture & Arts Activities",
    description:
      "Enrich your day with cultural experiences — museum visits, gallery walks, live theatre, cultural festivals, historical tours, concerts, and more.",
  },
  creative: {
    headline: "Creative Activities & Hobbies",
    description:
      "Express yourself today — painting, photography, writing, music, collage, film-making, journaling, and dozens more creative activity ideas for all skill levels.",
  },
  wellness: {
    headline: "Wellness Activities",
    description:
      "Take care of yourself today — yoga, meditation, long walks, spa days, breathwork, cold dips, forest bathing, and more wellness activities for body and mind.",
  },
  adventure: {
    headline: "Adventure Activities",
    description:
      "Get your adrenaline fix — rock climbing, bungee jumping, skydiving, off-road cycling, coasteering, urban exploring, and more adventure ideas for thrill seekers.",
  },
  sports: {
    headline: "Sports & Fitness Activities",
    description:
      "Get active today — basketball, tennis, swimming, running, surfing, martial arts, frisbee, football, and more sports and fitness activity ideas.",
  },
  lifestyle: {
    headline: "Lifestyle Activities",
    description:
      "Improve your day-to-day — declutter your space, start a new habit, plan a trip, learn something new, rearrange your room, or try a new morning routine.",
  },
  crafts: {
    headline: "Crafts & Making Activities",
    description:
      "Make something today — pottery, knitting, origami, woodworking, candle-making, jewellery, embroidery, scrapbooking, and more hands-on craft activity ideas.",
  },
  gaming: {
    headline: "Gaming Activities",
    description:
      "Play something today — board games, card games, escape rooms, video games, puzzle nights, tabletop RPGs, and more gaming ideas for solo or group fun.",
  },
  nightlife: {
    headline: "Nightlife & Evening Activities",
    description:
      "Make tonight memorable — rooftop bars, comedy nights, jazz clubs, late-night food crawls, stargazing, drive-in movies, and more evening activity ideas.",
  },
};

interface Props {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return ALL_CATEGORIES.map((c) => ({ category: c }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  if (!ALL_CATEGORIES.includes(category)) return {};
  const meta = CAT_META[category];
  const color = CAT_COLOR[category] || "#6366f1";
  const count = ALL_ACTIVITIES.filter((a) => a.tags[0] === category).length;
  return {
    title: `${meta.headline} — What do I do today?`,
    description: meta.description,
    openGraph: {
      title: `${meta.headline} — What do I do today?`,
      description: meta.description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${meta.headline} — What do I do today?`,
      description: meta.description,
    },
    alternates: {
      canonical: `https://what-do-i-do-today.vercel.app/categories/${category}`,
    },
    other: {
      "theme-color": color,
    },
  };
  void count;
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  if (!ALL_CATEGORIES.includes(category)) notFound();

  const meta = CAT_META[category];
  const color = CAT_COLOR[category] || "#6366f1";
  const emoji = CAT_EMOJI[category] || "✨";
  const activities = ALL_ACTIVITIES.filter((a) => a.tags[0] === category);
  const featured = activities.slice(0, 24);

  return (
    <main style={{ minHeight: "100dvh", background: "#f7f5ff", color: "#111827" }}>
      {/* Hero */}
      <div
        style={{
          background: `linear-gradient(135deg, ${color}22, ${color}08)`,
          borderBottom: `2px solid ${color}20`,
          padding: "48px 20px 40px",
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>{emoji}</div>
          <h1
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: "#111827",
              marginBottom: 12,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            {meta.headline}
          </h1>
          <p style={{ color: "#6b7280", fontSize: 16, lineHeight: 1.7, marginBottom: 24, maxWidth: 520 }}>
            {meta.description}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <Link
              href="/"
              style={{
                display: "inline-block",
                background: `linear-gradient(135deg, #6366f1, #8b5cf6)`,
                color: "white",
                padding: "13px 24px",
                borderRadius: 14,
                fontWeight: 700,
                fontSize: 15,
                textDecoration: "none",
                boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
              }}
            >
              🎲 Try the activity finder
            </Link>
            <span style={{ fontSize: 13, color: "#9ca3af" }}>
              {activities.length} {category} activities
            </span>
          </div>
        </div>
      </div>

      {/* Activity grid */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 20px" }}>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#111827",
            marginBottom: 20,
            letterSpacing: "-0.01em",
          }}
        >
          {activities.length} {category} ideas to try today
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 14,
            marginBottom: 40,
          }}
        >
          {featured.map((a) => (
            <div
              key={a.id}
              style={{
                background: "white",
                borderRadius: 16,
                padding: "16px 14px",
                border: `1.5px solid ${color}20`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>{a.emoji}</div>
              <div style={{ fontWeight: 700, color: "#111827", fontSize: 14, marginBottom: 4 }}>
                {a.title}
              </div>
              <div style={{ color: "#6b7280", fontSize: 12, lineHeight: 1.5 }}>{a.desc}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                <span
                  style={{
                    fontSize: 10,
                    padding: "2px 7px",
                    borderRadius: 8,
                    background: `${color}15`,
                    color: color,
                    fontWeight: 600,
                    border: `1px solid ${color}25`,
                  }}
                >
                  {a.budget === "free" ? "Free" : a.budget === "cheap" ? "Budget" : a.budget === "moderate" ? "Moderate" : "Splurge"}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    padding: "2px 7px",
                    borderRadius: 8,
                    background: "#f3f4f6",
                    color: "#6b7280",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  {a.effort} effort
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          style={{
            background: "white",
            borderRadius: 20,
            padding: "28px 24px",
            textAlign: "center",
            border: "1.5px solid #e9d5ff",
            boxShadow: "0 4px 20px rgba(99,102,241,0.08)",
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 10 }}>✨</div>
          <div style={{ fontWeight: 800, fontSize: 20, color: "#111827", marginBottom: 8 }}>
            Not sure where to start?
          </div>
          <p style={{ color: "#6b7280", marginBottom: 20, fontSize: 14 }}>
            Use the swipe finder — like what sounds good, skip what doesn&apos;t. The algorithm
            learns your vibe as you go.
          </p>
          <Link
            href="/"
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "white",
              padding: "13px 28px",
              borderRadius: 14,
              fontWeight: 700,
              fontSize: 15,
              textDecoration: "none",
              boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
            }}
          >
            Find my activity →
          </Link>
        </div>

        {/* Browse other categories */}
        <div style={{ marginTop: 40 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#374151", marginBottom: 14 }}>
            Browse other categories
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {ALL_CATEGORIES.filter((c) => c !== category).map((c) => (
              <Link
                key={c}
                href={`/categories/${c}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  borderRadius: 20,
                  background: "white",
                  border: `1.5px solid ${CAT_COLOR[c] || "#e5e7eb"}30`,
                  color: "#374151",
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: "none",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                {CAT_EMOJI[c]} {c.charAt(0).toUpperCase() + c.slice(1)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
