"use client";

import { useState } from "react";
import { Chip } from "./Chip";
import { FilterSection } from "./FilterSection";
import { ALL_ACTIVITIES } from "@/lib/activities";
import { CAT_COLOR, CAT_EMOJI, ALL_CATEGORIES } from "@/lib/constants";
import { buildPool } from "@/lib/algorithm";

interface Filters {
  categories: string[];
  budget: string[];
  weather: string[];
  vibe: string[];
}

interface FilterScreenProps {
  onStart: (filters: Filters) => void;
}

const BUDGETS: [string, string][] = [
  ["free", "Free 🆓"],
  ["cheap", "Budget 💰"],
  ["moderate", "Moderate 💳"],
  ["splurge", "Splurge 🥂"],
];

const WEATHERS: [string, string][] = [
  ["sunny", "Sunny ☀️"],
  ["cloudy", "Cloudy 🌥️"],
  ["any", "Any 🌈"],
];

const VIBES: [string, string][] = [
  ["solo", "Solo 🙋"],
  ["date", "Date / Together 💑"],
];

export function FilterScreen({ onStart }: FilterScreenProps) {
  const [sel, setSel] = useState<Filters>({ categories: [], budget: [], weather: [], vibe: [] });

  function toggle(key: keyof Filters, val: string) {
    setSel((s) => ({
      ...s,
      [key]: s[key].includes(val) ? s[key].filter((x) => x !== val) : [...s[key], val],
    }));
  }

  function surpriseMe() {
    const pool = ALL_ACTIVITIES;
    const random = pool[Math.floor(Math.random() * pool.length)];
    onStart({ categories: [random.tags[0]], budget: [], weather: [], vibe: [] });
  }

  const count = buildPool(ALL_ACTIVITIES, sel).length;

  return (
    <div className="min-h-screen bg-[#0b0818] text-[#f0eeff] flex flex-col">
      <div className="max-w-[440px] mx-auto px-5 pt-10 pb-16 w-full">
        {/* Header */}
        <div className="text-center mb-7">
          <div className="text-5xl mb-3">✨</div>
          <h1 className="text-3xl font-extrabold text-[#f0eeff] mb-2 tracking-tight">What do I do today?</h1>
          <p className="text-[#9d9bc7] text-sm leading-relaxed max-w-xs mx-auto">
            Swipe through 1,239 ideas across 12 categories. The more you swipe, the smarter it gets — liking and
            skipping teaches it exactly what you&apos;re in the mood for.
          </p>
        </div>

        {/* Primary CTA */}
        <button
          style={{
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            boxShadow: "0 4px 24px rgba(99,102,241,0.4)",
          }}
          className="w-full py-4 rounded-2xl text-white text-lg font-bold mb-8 cursor-pointer"
          onClick={() => onStart(sel)}
        >
          🎲 Start swiping — {count} activities
        </button>

        {/* Surprise me */}
        <button
          style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.3)", color: "#fbbf24" }}
          className="w-full py-3 rounded-2xl text-sm font-semibold mb-8 cursor-pointer"
          onClick={surpriseMe}
        >
          🎰 Surprise me — pick one randomly
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-7">
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-[#4b4a6e] text-xs whitespace-nowrap">or filter first</span>
          <div className="flex-1 h-px bg-white/8" />
        </div>

        {/* Filters */}
        <FilterSection label="Categories" hint="All if none selected">
          <div className="flex flex-wrap gap-2">
            {ALL_CATEGORIES.map((c) => (
              <Chip key={c} active={sel.categories.includes(c)} color={CAT_COLOR[c]} onClick={() => toggle("categories", c)}>
                {CAT_EMOJI[c]} {c.charAt(0).toUpperCase() + c.slice(1)}
              </Chip>
            ))}
          </div>
        </FilterSection>

        <FilterSection label="Budget">
          <div className="flex flex-wrap gap-2">
            {BUDGETS.map(([v, l]) => (
              <Chip key={v} active={sel.budget.includes(v)} onClick={() => toggle("budget", v)}>
                {l}
              </Chip>
            ))}
          </div>
        </FilterSection>

        <FilterSection label="Weather today">
          <div className="flex flex-wrap gap-2">
            {WEATHERS.map(([v, l]) => (
              <Chip key={v} active={sel.weather.includes(v)} onClick={() => toggle("weather", v)}>
                {l}
              </Chip>
            ))}
          </div>
        </FilterSection>

        <FilterSection label="Vibe">
          <div className="flex flex-wrap gap-2">
            {VIBES.map(([v, l]) => (
              <Chip key={v} active={sel.vibe.includes(v)} onClick={() => toggle("vibe", v)}>
                {l}
              </Chip>
            ))}
          </div>
        </FilterSection>

        {/* Secondary CTA */}
        <button
          style={{
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            boxShadow: "0 4px 24px rgba(99,102,241,0.35)",
          }}
          className="w-full py-4 rounded-2xl text-white text-base font-bold cursor-pointer"
          onClick={() => onStart(sel)}
        >
          🎲 Start swiping — {count} activities
        </button>
      </div>
    </div>
  );
}
