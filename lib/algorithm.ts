import type { Activity } from "./activities";

export function scoreActivity(
  activity: Activity,
  tagScores: Record<string, number>,
  dislikedTags: Record<string, number>
): number {
  let score = 0;
  for (const tag of activity.tags) {
    score += tagScores[tag] || 0;
    score -= (dislikedTags[tag] || 0) * 0.6;
  }
  return score + Math.random() * 0.3;
}

export function pickNext(
  pool: Activity[],
  tagScores: Record<string, number>,
  dislikedTags: Record<string, number>,
  swipeCount: number,
  recentCategories: string[],
  seenIds: Set<number>
): Activity | null {
  const unseen = pool.filter((a) => !seenIds.has(a.id));
  const available = unseen.length > 0 ? unseen : pool;

  if (swipeCount < 10) {
    const cats = [
      "outdoors", "food", "social", "culture", "creative", "wellness",
      "adventure", "sports", "lifestyle", "crafts", "gaming", "nightlife",
    ];
    const usedCats = new Set(recentCategories.slice(-4));
    const freshCats = cats.filter((c) => !usedCats.has(c));
    const targetCats = freshCats.length > 0 ? freshCats : cats;
    const candidates = available.filter((a) => targetCats.includes(a.tags[0]));
    const pool2 = candidates.length > 0 ? candidates : available;
    return pool2[Math.floor(Math.random() * pool2.length)] ?? null;
  }

  if (swipeCount < 20) {
    if (Math.random() < 0.4) {
      return available[Math.floor(Math.random() * available.length)] ?? null;
    }
  }

  const scored = available.map((a) => ({
    a,
    s: scoreActivity(a, tagScores, dislikedTags),
  }));
  scored.sort((x, y) => y.s - x.s);
  const topN = Math.max(5, Math.floor(scored.length * 0.15));
  const top = scored.slice(0, topN);
  return top[Math.floor(Math.random() * top.length)]?.a ?? null;
}

export function buildPool(
  activities: Activity[],
  filters: {
    categories: string[];
    budget: string[];
    weather: string[];
    vibe: string[];
  }
): Activity[] {
  return activities.filter((a) => {
    if (filters.categories.length && !filters.categories.includes(a.tags[0])) return false;
    if (filters.budget.length && !filters.budget.includes(a.budget)) return false;
    if (filters.weather.length && !filters.weather.includes(a.weather) && a.weather !== "any") return false;
    if (filters.vibe.includes("solo") && !a.solo) return false;
    if (filters.vibe.includes("date") && !a.date) return false;
    return true;
  });
}
