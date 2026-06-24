import type { Metadata } from "next";
import { ALL_ACTIVITIES } from "@/lib/activities";
import { ALL_CATEGORIES, CAT_EMOJI } from "@/lib/constants";
import { SwipeApp } from "@/components/SwipeApp";

export const metadata: Metadata = {
  title: "What do I do today? — Find Something Fun",
  description:
    "Swipe through 1,239 activity ideas across 12 categories. Find the perfect thing to do today — date night ideas, things to do with friends, outdoor adventures, creative projects, and more.",
};

function StaticActivityList() {
  const samples = ALL_ACTIVITIES.slice(0, 30);
  return (
    <section className="sr-only" aria-label="Sample activities">
      <h2>Activity Ideas — {ALL_ACTIVITIES.length} things to do today</h2>
      <p>
        Browse {ALL_ACTIVITIES.length} activity ideas across {ALL_CATEGORIES.length} categories including outdoors,
        food, social, culture, creative, wellness, adventure, sports, lifestyle, crafts, gaming, and nightlife.
      </p>
      <ul>
        {samples.map((a) => (
          <li key={a.id}>
            {a.emoji} {a.title}: {a.desc}
          </li>
        ))}
      </ul>
      <h3>Categories</h3>
      <ul>
        {ALL_CATEGORIES.map((c) => (
          <li key={c}>
            {CAT_EMOJI[c]} {c.charAt(0).toUpperCase() + c.slice(1)}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <StaticActivityList />
      <SwipeApp />
    </>
  );
}
