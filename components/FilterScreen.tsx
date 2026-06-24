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
    <div style={{ background: "#f7f5ff", minHeight: "100dvh", color: "#111827" }}>
      <div className="max-w-[440px] mx-auto px-5 pt-10 pb-16 w-full">
        {/* Header */}
        <div className="text-center mb-7">
          <div className="text-5xl mb-3">✨</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", marginBottom: 8, letterSpacing: "-0.02em" }}>
            What do I do today?
          </h1>
          <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6, maxWidth: 300, margin: "0 auto" }}>
            Swipe through 1,239 ideas across 12 categories. The more you swipe, the smarter it gets.
          </p>
        </div>

        {/* Primary CTA */}
        <button
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: 18,
            border: "none",
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            color: "white",
            fontSize: 16,
            fontWeight: 700,
            marginBottom: 12,
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
          }}
          onClick={() => onStart(sel)}
        >
          🎲 Start swiping — {count} activities
        </button>

        {/* Surprise me */}
        <button
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 14,
            border: "1.5px solid #e9d5ff",
            background: "#faf5ff",
            color: "#7c3aed",
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 28,
            cursor: "pointer",
          }}
          onClick={surpriseMe}
        >
          🎰 Surprise me — pick one randomly
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-7">
          <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
          <span style={{ color: "#9ca3af", fontSize: 12 }}>or filter first</span>
          <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
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
              <Chip key={v} active={sel.budget.includes(v)} onClick={() => toggle("budget", v)}>{l}</Chip>
            ))}
          </div>
        </FilterSection>

        <FilterSection label="Weather today">
          <div className="flex flex-wrap gap-2">
            {WEATHERS.map(([v, l]) => (
              <Chip key={v} active={sel.weather.includes(v)} onClick={() => toggle("weather", v)}>{l}</Chip>
            ))}
          </div>
        </FilterSection>

        <FilterSection label="Vibe">
          <div className="flex flex-wrap gap-2">
            {VIBES.map(([v, l]) => (
              <Chip key={v} active={sel.vibe.includes(v)} onClick={() => toggle("vibe", v)}>{l}</Chip>
            ))}
          </div>
        </FilterSection>

        <button
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: 18,
            border: "none",
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            color: "white",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(99,102,241,0.3)",
          }}
          onClick={() => onStart(sel)}
        >
          🎲 Start swiping — {count} activities
        </button>
      </div>
    </div>
  );
}
