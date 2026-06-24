import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSession, tallyVotes } from "@/lib/voteStore";
import { ALL_ACTIVITIES } from "@/lib/activities";
import { GroupVotePage } from "@/components/GroupVotePage";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const session = await getSession(id);
  if (!session) return { title: "Vote not found" };

  const activities = ALL_ACTIVITIES.filter((a) => session.activityIds.includes(a.id));
  const names = activities
    .slice(0, 4)
    .map((a) => a.title)
    .join(", ");

  return {
    title: "Vote on what we're doing tonight",
    description: `Choose between: ${names}${activities.length > 4 ? `, and ${activities.length - 4} more` : ""}`,
    openGraph: {
      title: "Vote on what we're doing tonight",
      description: `${activities.length} options to vote on. Choose between: ${names}`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: "Vote on what we're doing tonight",
      description: `${activities.length} options. Choose between: ${names}`,
    },
  };
}

export default async function VotePage({ params }: Props) {
  const { id } = await params;
  const session = await getSession(id);
  if (!session) notFound();

  const activities = ALL_ACTIVITIES.filter((a) => session.activityIds.includes(a.id));
  const tally = tallyVotes(session);

  return (
    <GroupVotePage
      sessionId={id}
      activities={activities}
      initialVotes={tally}
      initialVoterCount={session.votes.length}
    />
  );
}
