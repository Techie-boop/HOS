import { getSessionUser } from "../../../../lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "../../../../lib/db";
import JudgingManager from "./JudgingManager";

export default async function OrganizerJudgingPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/sign-in");
  }

  const hackathons = await prisma.hackathon.findMany({
    where: { organizerId: user.id },
    select: { id: true, title: true },
    orderBy: { createdAt: "desc" },
  });

  // Fetch all judges created by this organizer
  const judges = await prisma.judge.findMany({
    where: {
      hackathon: {
        organizerId: user.id,
      },
    },
    include: {
      hackathon: {
        select: { title: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch all guidelines created by this organizer
  const guidelines = await prisma.judgingGuideline.findMany({
    where: {
      hackathon: {
        organizerId: user.id,
      },
    },
    include: {
      hackathon: {
        select: { title: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-6 md:p-8 w-full space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">Judging & Panels Configuration</h2>
        <p className="text-sm text-zinc-500">Add experts to evaluation panels, upload profiles, and define rubrics/guidelines</p>
      </div>

      <JudgingManager
        hackathons={hackathons}
        initialJudges={judges}
        initialGuidelines={guidelines}
      />
    </main>
  );
}
