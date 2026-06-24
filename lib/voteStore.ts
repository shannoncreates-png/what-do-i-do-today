/**
 * Vote session storage.
 * Uses Vercel KV when KV_REST_API_URL is set; falls back to in-memory for local dev.
 * In-memory store resets on cold start — use Vercel KV for persistence.
 */

export interface VoteSession {
  id: string;
  activityIds: number[];
  votes: Array<{ name: string; votes: Record<number, boolean>; ts: number }>;
  createdAt: number;
}

// ── In-memory fallback (local dev) ─────────────────────────────────────────
const memStore = new Map<string, VoteSession>();

function useKV(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

async function getKV() {
  const { kv } = await import("@vercel/kv");
  return kv;
}

export async function createSession(id: string, activityIds: number[]): Promise<void> {
  const session: VoteSession = { id, activityIds, votes: [], createdAt: Date.now() };
  if (useKV()) {
    const kv = await getKV();
    await kv.set(`vote:${id}`, session, { ex: 60 * 60 * 24 * 7 }); // 7 days
  } else {
    memStore.set(id, session);
  }
}

export async function getSession(id: string): Promise<VoteSession | null> {
  if (useKV()) {
    const kv = await getKV();
    return (await kv.get<VoteSession>(`vote:${id}`)) ?? null;
  }
  return memStore.get(id) ?? null;
}

export async function addVote(
  id: string,
  entry: { name: string; votes: Record<number, boolean>; ts: number }
): Promise<VoteSession | null> {
  const session = await getSession(id);
  if (!session) return null;
  session.votes.push(entry);
  if (useKV()) {
    const kv = await getKV();
    await kv.set(`vote:${id}`, session, { ex: 60 * 60 * 24 * 7 });
  } else {
    memStore.set(id, session);
  }
  return session;
}

export function tallyVotes(session: VoteSession): Record<string, number> {
  const tally: Record<string, number> = {};
  for (const entry of session.votes) {
    for (const [idStr, v] of Object.entries(entry.votes)) {
      if (v) tally[idStr] = (tally[idStr] || 0) + 1;
    }
  }
  return tally;
}
