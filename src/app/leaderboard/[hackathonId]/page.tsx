import { prisma } from "../../../lib/db";
import { notFound } from "next/navigation";
import { Crown, Medal, Trophy } from "lucide-react";
import React from "react";

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-300 px-2.5 py-0.5">
        <Crown className="w-3 h-3" strokeWidth={2.5} /> 1st
      </span>
    );
  if (rank === 2)
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 bg-zinc-100 border border-zinc-300 px-2.5 py-0.5">
        <Medal className="w-3 h-3" strokeWidth={2.5} /> 2nd
      </span>
    );
  if (rank === 3)
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-orange-700 bg-orange-50 border border-orange-300 px-2.5 py-0.5">
        <Medal className="w-3 h-3" strokeWidth={2.5} /> 3rd
      </span>
    );
  return <span className="text-xs font-bold text-zinc-400">#{rank}</span>;
}

function getLevel(score: number) {
  if (score >= 900) return { label: "Platinum", cls: "text-sky-700 bg-sky-50 border-sky-300" };
  if (score >= 700) return { label: "Gold",     cls: "text-amber-700 bg-amber-50 border-amber-300" };
  if (score >= 500) return { label: "Silver",   cls: "text-zinc-600 bg-zinc-100 border-zinc-400" };
  if (score >= 300) return { label: "Bronze",   cls: "text-orange-700 bg-orange-50 border-orange-300" };
  if (score >= 100) return { label: "Rookie",   cls: "text-emerald-700 bg-emerald-50 border-emerald-300" };
  return              { label: "Unranked", cls: "text-zinc-400 bg-zinc-50 border-zinc-200" };
}

export default async function PublicLeaderboardPage({
  params,
}: {
  params: Promise<{ hackathonId: string }>;
}) {
  const { hackathonId } = await params;

  // Fetch hackathon info
  const hackathon = await prisma.hackathon.findUnique({
    where: { id: hackathonId },
    select: { id: true, title: true, publishLeaderboard: true },
  });

  if (!hackathon) {
    notFound();
  }

  // Fetch all teams registered for this hackathon
  const allTeams = await prisma.team.findMany({
    where: { hackathonId },
    select: {
      id: true,
      teamName: true,
      teamLeadName: true,
      score: true,
      avatarUrl: true,
      createdAt: true,
      _count: { select: { members: true } },
    },
    orderBy: [{ score: "desc" }, { createdAt: "asc" }],
  });

  type RankedTeam = (typeof allTeams)[number] & { rank: number };
  const ranked: RankedTeam[] = [];
  for (let i = 0; i < allTeams.length; i++) {
    const t = allTeams[i];
    const rank =
      i === 0 ? 1
      : allTeams[i - 1].score === t.score ? ranked[i - 1].rank
      : i + 1;
    ranked.push({ ...t, rank });
  }

  const maxScore = Math.max(...ranked.map((r) => r.score), 1);
  const totalTeams = ranked.length;

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans">
      
      {/* Public Header */}
      <header className="w-full bg-[#E61E32] border-b border-[#c91527] px-6 py-4 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-2 text-white text-lg tracking-tight">
          <span className="font-semibold text-white/80">
            HackOS Live Standings
          </span>
          <span className="text-white/40 font-light">/</span>
          <span className="font-bold text-white">
            {hackathon.title}
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-6 md:p-8 max-w-[1400px] w-full mx-auto space-y-6 animate-in fade-in duration-200">

        {/* Check if published */}
        {!hackathon.publishLeaderboard ? (
          <div className="border border-zinc-300 bg-white p-16 text-center rounded-none shadow-sm max-w-xl mx-auto mt-12 space-y-4">
            <Trophy className="w-12 h-12 text-zinc-300 mx-auto" strokeWidth={1.5} />
            <h3 className="text-base font-bold text-zinc-900">Leaderboard Draft State</h3>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-sm mx-auto">
              Standings for this event are currently being evaluated and finalized by organizers. Rankings will appear here live once published.
            </p>
          </div>
        ) : (
          /* Rankings Table */
          <div className="border border-zinc-300 overflow-x-auto shadow-sm">
            <table className="w-full text-sm border-collapse bg-white">
              <thead>
                <tr className="bg-zinc-100 text-zinc-700 border-b border-zinc-300">
                  <th className="text-left text-[10px] font-extrabold uppercase tracking-widest px-5 py-3.5 w-14 border-r border-zinc-200">#</th>
                  <th className="text-left text-[10px] font-extrabold uppercase tracking-widest px-5 py-3.5 border-r border-zinc-200">Team Name</th>
                  <th className="text-left text-[10px] font-extrabold uppercase tracking-widest px-5 py-3.5 border-r border-zinc-200">TL</th>
                  <th className="text-left text-[10px] font-extrabold uppercase tracking-widest px-5 py-3.5 border-r border-zinc-200 w-24">Rank</th>
                  <th className="text-left text-[10px] font-extrabold uppercase tracking-widest px-5 py-3.5 border-r border-zinc-200 w-24">Level</th>
                  <th className="text-left text-[10px] font-extrabold uppercase tracking-widest px-5 py-3.5 w-48">Score</th>
                </tr>
              </thead>
              <tbody>
                {ranked.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-zinc-400 text-xs bg-white">
                      No teams registered yet.
                    </td>
                  </tr>
                ) : (
                  ranked.map((row, idx) => {
                    const lvl = getLevel(row.score);
                    const pct = row.score > 0 ? Math.round((row.score / maxScore) * 100) : 0;

                    return (
                      <tr
                        key={row.id}
                        className="border-b border-zinc-200 last:border-0 transition-colors bg-white hover:bg-zinc-50/60"
                      >
                        {/* # */}
                        <td className="px-5 py-4 text-xs font-bold text-zinc-400 border-r border-zinc-200">
                          {idx + 1}
                        </td>

                        {/* Team Name */}
                        <td className="px-5 py-4 border-r border-zinc-200">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 overflow-hidden bg-zinc-200 text-zinc-655 flex items-center justify-center text-xs font-extrabold uppercase shrink-0">
                              {row.avatarUrl ? (
                                <img src={row.avatarUrl} alt="Avatar" className="w-full h-full object-contain" />
                              ) : (
                                row.teamName.charAt(0)
                              )}
                            </div>
                            <div>
                              <span className="text-sm font-bold text-zinc-900">{row.teamName}</span>
                              <p className="text-[10px] text-zinc-400 mt-0.5">{row._count.members + 1} members</p>
                            </div>
                          </div>
                        </td>

                        {/* TL */}
                        <td className="px-5 py-4 text-xs font-medium text-zinc-600 border-r border-zinc-200">
                          {row.teamLeadName}
                        </td>

                        {/* Rank */}
                        <td className="px-5 py-4 border-r border-zinc-200">
                          <RankBadge rank={row.rank} />
                        </td>

                        {/* Level */}
                        <td className="px-5 py-4 border-r border-zinc-200">
                          <span className={`text-[10px] font-extrabold uppercase tracking-wider border px-2 py-0.5 ${lvl.cls}`}>
                            {lvl.label}
                          </span>
                        </td>

                        {/* Score with bar */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-extrabold tabular-nums w-14 shrink-0 text-zinc-900">
                              {row.score > 0 ? row.score.toLocaleString() : "—"}
                            </span>
                            {row.score > 0 && (
                              <div className="flex-1 h-1.5 bg-zinc-200 overflow-hidden min-w-[60px]">
                                <div
                                  className="h-full bg-zinc-650"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* Footer */}
            <div className="bg-zinc-50 border-t border-zinc-200 px-5 py-2.5 flex justify-between items-center text-[10px] text-zinc-400 font-semibold">
              <p>Live rankings feed · Powered by HackOS Platform</p>
              <p>Updated in real-time by event moderators</p>
            </div>
          </div>
        )}

      </main>

      {/* Powered by logo footer at bottom */}
      <footer className="border-t border-zinc-200 py-4 text-center text-xs text-zinc-600 font-semibold bg-white shrink-0 w-full flex flex-col sm:flex-row items-center justify-center gap-2">
        <span>© 2026 HackOS Platform. All Rights Reserved.</span>
        <span className="hidden sm:inline text-zinc-300">|</span>
        <div className="flex items-center gap-1.5 font-normal text-zinc-600">
          <span>Powered by</span>
          <img 
            src="https://ik.imagekit.io/dypkhqxip/redlix%20new?updatedAt=1781042212493" 
            alt="Redlix Logo" 
            className="h-6.5 object-contain brightness-95 opacity-90 hover:opacity-100 hover:brightness-100 transition-all"
          />
        </div>
      </footer>

    </div>
  );
}
