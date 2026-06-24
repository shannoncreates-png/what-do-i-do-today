"use client";

import { useState, useEffect } from "react";
import { ResumeScreen } from "./ResumeScreen";
import { FilterScreen } from "./FilterScreen";
import { SwipeScreen } from "./SwipeScreen";
import { ResultScreen } from "./ResultScreen";
import { GroupSetupScreen } from "./GroupSetupScreen";
import { ALL_ACTIVITIES } from "@/lib/activities";
import { pickNext, buildPool } from "@/lib/algorithm";
import { saveSession, loadSession, clearSession } from "@/lib/storage";
import type { SessionData, SwipeState } from "@/lib/storage";

type Screen = "resume" | "filter" | "swipe" | "result" | "group";

interface Filters {
  categories: string[];
  budget: string[];
  weather: string[];
  vibe: string[];
}

export function SwipeApp() {
  const [screen, setScreen] = useState<Screen>("filter");
  const [savedSession, setSavedSession] = useState<SessionData | null>(null);
  const [filters, setFilters] = useState<Filters>({ categories: [], budget: [], weather: [], vibe: [] });
  const [swipeState, setSwipeState] = useState<SwipeState | null>(null);
  const [showGrid, setShowGrid] = useState(false);

  useEffect(() => {
    const session = loadSession();
    if (session) {
      setSavedSession(session);
      setScreen("resume");
    }
  }, []);

  function startFresh() {
    clearSession();
    setSavedSession(null);
    setScreen("filter");
  }

  function resumeSession() {
    if (!savedSession) return;
    setFilters(savedSession.filters || { categories: [], budget: [], weather: [], vibe: [] });
    setSwipeState({
      ...savedSession.swipeState,
      seenIds: savedSession.swipeState.seenIds || [],
    });
    setScreen("swipe");
  }

  function applyFilters(f: Filters) {
    setFilters(f);
    const pool = buildPool(ALL_ACTIVITIES, f);
    const seenSet = new Set<number>();
    const initial = pickNext(pool, {}, {}, 0, [], seenSet);
    if (initial) seenSet.add(initial.id);
    const state: SwipeState = {
      pool,
      current: initial,
      liked: [],
      swipeCount: 0,
      tagScores: {},
      dislikedTags: {},
      recentCategories: [],
      seenIds: Array.from(seenSet),
    };
    setSwipeState(state);
    setScreen("swipe");
  }

  function updateSwipeState(s: SwipeState) {
    setSwipeState(s);
    saveSession({ filters, swipeState: s });
  }

  if (screen === "resume" && savedSession) {
    return <ResumeScreen session={savedSession} onResume={resumeSession} onFresh={startFresh} />;
  }

  if (screen === "filter") {
    return <FilterScreen onStart={applyFilters} />;
  }

  if (screen === "swipe" && swipeState) {
    return (
      <SwipeScreen
        swipeState={swipeState}
        onUpdate={updateSwipeState}
        onSelect={() => setScreen("result")}
        onShowGrid={() => setShowGrid(true)}
        showGrid={showGrid}
        onCloseGrid={() => setShowGrid(false)}
      />
    );
  }

  if (screen === "result" && swipeState) {
    return (
      <ResultScreen
        liked={swipeState.liked}
        onRestart={startFresh}
        onShowGrid={() => setShowGrid(true)}
        showGrid={showGrid}
        onCloseGrid={() => setShowGrid(false)}
        onGroupVote={() => setScreen("group")}
      />
    );
  }

  if (screen === "group" && swipeState) {
    return <GroupSetupScreen liked={swipeState.liked} onBack={() => setScreen("result")} />;
  }

  return <FilterScreen onStart={applyFilters} />;
}
