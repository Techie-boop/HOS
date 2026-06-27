import { getSessionTeam } from "../../../lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "../../../lib/db";
import { Trophy, Users, Link2 } from "lucide-react";

export default async function TeamOverviewPage() {
  const team = await getSessionTeam();

  if (!team) {
    redirect("/team/login");
  }

  const hackathon = team.hackathon;
  const squadSize = 1 + (team.members?.length || 0);

  // Query live task metrics from the database
  const tasks = await prisma.task.findMany({
    where: { teamId: team.id },
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <main className="flex-grow p-6 md:p-8 max-w-[1400px] w-full space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Welcome Profile Card (Reduced height & sharp edges) */}
      <section className="bg-white border border-zinc-200 rounded-none p-4 md:p-5 shadow-sm flex flex-col justify-between items-start gap-1">
        <span className="text-[10px] uppercase tracking-widest text-[#E61E32] font-extrabold">Active Team Portal</span>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900 mt-0.5">
          Welcome back, {team.user.fullName}
        </h2>
        <div className="text-xs text-zinc-500 font-normal mt-0.5 flex flex-wrap items-center gap-2">
          <span>Team: <span className="font-semibold text-zinc-700">{team.teamName}</span></span>
          <span className="text-zinc-300">|</span>
          <span>Role: <span className="font-bold text-[#E61E32]">{team.isLead ? "Team Lead" : "Team Member"}</span></span>
        </div>
      </section>

      {/* 2. PROGRESS STAT BOXES (Reduced padding/height & sharp edges) */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        
        {/* Stat Box 1: Project Submission */}
        <div className="bg-amber-50 border border-amber-200 rounded-none p-3.5 flex flex-col gap-1 shadow-sm transition-all duration-200 hover:shadow-md">
          <span className="text-[9px] font-extrabold text-amber-600 uppercase tracking-widest">Project</span>
          <span className="text-[11px] font-extrabold text-amber-800 flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-none bg-amber-500 animate-pulse" /> Pending
          </span>
        </div>

        {/* Stat Box 2: Squad Formation */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-none p-3.5 flex flex-col gap-1 shadow-sm transition-all duration-200 hover:shadow-md">
          <span className="text-[9px] font-extrabold text-emerald-600 uppercase tracking-widest">Squad</span>
          <span className="text-[11px] font-extrabold text-emerald-800 flex items-center gap-1.5 mt-0.5">
            {squadSize >= 2 ? (
              <>
                <span className="w-2 h-2 rounded-none bg-emerald-500" /> {squadSize} Active
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-none bg-amber-500" /> Solo Team
              </>
            )}
          </span>
        </div>

        {/* Stat Box 3: Leaderboard Rank */}
        <div className="bg-sky-50 border border-sky-200 rounded-none p-3.5 flex flex-col gap-1 shadow-sm transition-all duration-200 hover:shadow-md">
          <span className="text-[9px] font-extrabold text-sky-600 uppercase tracking-widest">Rank</span>
          <span className="text-[11px] font-extrabold text-sky-800 flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-none bg-sky-400" /> Not Ranked
          </span>
        </div>

        {/* Stat Box 4: Certificates Status */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-none p-3.5 flex flex-col gap-1 shadow-sm transition-all duration-200 hover:shadow-md">
          <span className="text-[9px] font-extrabold text-indigo-600 uppercase tracking-widest">Certificates</span>
          <span className="text-[11px] font-extrabold text-indigo-800 flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-none bg-indigo-400" /> Locked
          </span>
        </div>

        {/* Stat Box 5: Completed Tasks */}
        <div className="bg-purple-50 border border-purple-200 rounded-none p-3.5 flex flex-col gap-1 shadow-sm transition-all duration-200 hover:shadow-md">
          <span className="text-[9px] font-extrabold text-purple-600 uppercase tracking-widest">Tasks</span>
          <span className="text-[11px] font-extrabold text-purple-800 flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-none bg-purple-500" /> {completedTasks} / {totalTasks}
          </span>
        </div>

        {/* Stat Box 6: Task Velocity */}
        <div className="bg-rose-50 border border-rose-200 rounded-none p-3.5 flex flex-col gap-1 shadow-sm transition-all duration-200 hover:shadow-md">
          <span className="text-[9px] font-extrabold text-rose-600 uppercase tracking-widest">Velocity</span>
          <span className="text-[11px] font-extrabold text-rose-800 flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-none bg-rose-550" /> {completionRate}%
          </span>
        </div>

      </div>

      {/* 3. INVITE CODE ALERT BANNER (Reduced height & sharp edges) */}
      <section className="bg-red-50 border border-red-200 rounded-none p-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
        <div className="space-y-0.5 text-center sm:text-left">
          <h4 className="text-xs font-bold text-zinc-905 flex items-center justify-center sm:justify-start gap-1.5">
            <Link2 className="w-4 h-4 text-[#E61E32]" strokeWidth={2.5} /> Team Invite Code
          </h4>
          <p className="text-[11px] text-zinc-500 font-normal">
            Share this code with teammates so they can join your team directly.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-base font-bold bg-white border border-red-200 text-[#E61E32] px-3.5 py-1 rounded-none tracking-widest shadow-inner">
            {team.joinCode}
          </span>
          <Link
            href={`/team/invite?joinCode=${team.joinCode}`}
            className="bg-[#E61E32] hover:bg-[#c91527] text-white px-3.5 py-1.5 rounded-none text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            Get Invite Link
          </Link>
        </div>
      </section>

    </main>
  );
}
