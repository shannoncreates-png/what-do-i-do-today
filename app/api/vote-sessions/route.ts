import { NextResponse } from "next/server";
import { createSession } from "@/lib/voteStore";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  const { activityIds } = await req.json();
  if (!Array.isArray(activityIds) || activityIds.length === 0) {
    return NextResponse.json({ error: "activityIds required" }, { status: 400 });
  }
  const id = nanoid(8);
  await createSession(id, activityIds);
  return NextResponse.json({ id });
}
