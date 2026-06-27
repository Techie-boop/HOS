import { getSessionJudge } from "../../../lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "../../../lib/db";
import { UserCheck } from "lucide-react";
import LogoutButton from "./LogoutButton";
import JuryConsole from "./JuryConsole";

export default async function JudgePanelPage() {
  const judge = await getSessionJudge();

  // Protect the panel page
  if (!judge) {
    redirect("/judge/login");
  }

  // Fetch all judging guidelines for this hackathon
  const guidelines = await prisma.judgingGuideline.findMany({
    where: { hackathonId: judge.hackathonId },
    select: { id: true, content: true },
    orderBy: { createdAt: "asc" },
  });

  // Fetch all project submissions for this hackathon
  const submissions = await prisma.projectSubmission.findMany({
    where: { hackathonId: judge.hackathonId },
    include: {
      team: { select: { teamName: true, teamLeadName: true, email: true } },
    },
    orderBy: { submittedAt: "desc" },
  });

  // Fetch all competing teams for this hackathon
  const teams = await prisma.team.findMany({
    where: { hackathonId: judge.hackathonId },
    include: {
      members: {
        select: { id: true, fullName: true, email: true },
      },
    },
    orderBy: { teamName: "asc" },
  });

  // Fetch all announcements for this hackathon
  const announcements = await prisma.announcement.findMany({
    where: { hackathonId: judge.hackathonId },
    select: { id: true, title: true, content: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans">
      
      {/* Top Header */}
      <header className="w-full bg-[#E61E32] border-b border-[#c91527] px-6 py-4 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-2 text-white text-lg tracking-tight">
          <span className="font-semibold text-white/80">HackOS Jury Console</span>
          <span className="text-white/40 font-light">/</span>
          <span className="font-bold text-white truncate max-w-[200px] sm:max-w-xs">{judge.hackathon.title}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-white/90 text-xs font-semibold">
            <UserCheck className="w-4 h-4 text-white/60" />
            <span>Judge: {judge.name}</span>
          </div>
          <LogoutButton />
        </div>
      </header>

      {/* Interactive Jury Dashboard Tabs Component */}
      <JuryConsole 
        judge={judge}
        submissions={submissions}
        teams={teams}
        announcements={announcements}
        guidelines={guidelines}
      />

    </div>
  );
}
