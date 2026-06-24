import { STORAGE_KEY } from "./constants";

export interface SwipeState {
  pool: import("./activities").Activity[];
  current: import("./activities").Activity | null;
  liked: import("./activities").Activity[];
  swipeCount: number;
  tagScores: Record<string, number>;
  dislikedTags: Record<string, number>;
  recentCategories: string[];
  seenIds: number[];
}

export interface SessionData {
  filters: {
    categories: string[];
    budget: string[];
    weather: string[];
    vibe: string[];
  };
  swipeState: SwipeState;
}

export function saveSession(data: SessionData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function loadSession(): SessionData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
