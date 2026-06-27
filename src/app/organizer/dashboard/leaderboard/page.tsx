import { getSessionUser } from "../../../../lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "../../../../lib/db";
import LeaderboardManager from "./LeaderboardManager";

export default async function OrganizerLeaderboardPage() {
  const organizer = await getSessionUser();
  if (!organizer) redirect("/sign-in");

  // Fetch all hackathons owned by this organizer along with their registered teams
  const hackathons = await prisma.hackathon.findMany({
    where: { organizerId: organizer.id },
    select: {
      id: true,
      title: true,
      publishLeaderboard: true,
      teams: {
        select: {
          id: true,
          teamName: true,
          teamLeadName: true,
          score: true,
        },
        orderBy: [{ score: "desc" }, { createdAt: "asc" }],
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="flex-grow p-6 md:p-8 max-w-[1400px] w-full space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">Leaderboard Manager</h2>
        <p className="text-sm text-zinc-500 mt-1">
          Control standings visibility and grade team scores across your active hackathons
        </p>
      </div>

      {/* manager component */}
      <LeaderboardManager hackathons={hackathons} />

    </main>
  );
}
