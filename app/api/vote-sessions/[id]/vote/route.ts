import { NextResponse } from "next/server";
import { addVote, tallyVotes } from "@/lib/voteStore";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { name, votes } = await req.json();
  if (!name || !votes) {
    return NextResponse.json({ error: "name and votes required" }, { status: 400 });
  }
  const session = await addVote(id, { name, votes, ts: Date.now() });
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }
  const tally = tallyVotes(session);
  return NextResponse.json({ tally, voterCount: session.votes.length });
}
