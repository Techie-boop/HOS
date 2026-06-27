import { getSessionTeam } from "../../../../lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "../../../../lib/db";
import { Crown, Medal, Trophy } from "lucide-react";

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

export default async function TeamLeaderboardPage() {
  const team = await getSessionTeam();
  if (!team) redirect("/team/login");

  const allTeams = await prisma.team.findMany({
    where: { hackathonId: team.hackathonId },
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

  const teamMembers = await prisma.teamMember.findMany({
    where: { teamId: team.id },
    select: { id: true, fullName: true, email: true, avatarUrl: true },
    orderBy: { createdAt: "asc" },
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
  const myRow = ranked.find((t) => t.id === team.id);
  const myLevel = getLevel(myRow?.score ?? 0);

  return (
    <main className="flex-grow p-6 md:p-8 max-w-[1400px] w-full space-y-8 animate-in fade-in duration-200">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">Leaderboard</h2>
        <p className="text-sm text-zinc-500 mt-1">
          Live standings · <span className="font-semibold text-zinc-700">{team.hackathon.title}</span>
        </p>
      </div>

      {/* Your position strip */}
      {myRow && team.hackathon.publishLeaderboard && (
        <div className="flex flex-wrap gap-8 pb-6 border-b border-zinc-200">
          {[
            { label: "Your Rank",  value: `#${myRow.rank}`, sub: `of ${ranked.length} teams` },
            { label: "Score",      value: myRow.score > 0 ? myRow.score.toLocaleString() : "—", sub: "points" },
            { label: "Team Size",  value: `${teamMembers.length + 1}`, sub: "members" },
          ].map(({ label, value, sub }) => (
            <div key={label}>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">{label}</p>
              <p className="text-2xl font-extrabold text-zinc-900 mt-0.5">{value}</p>
              <p className="text-[10px] text-zinc-400 mt-0.5">{sub}</p>
            </div>
          ))}
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">Level</p>
            <div className="mt-1.5">
              <span className={`text-[11px] font-extrabold uppercase tracking-wider border px-3 py-1 ${myLevel.cls}`}>
                {myLevel.label}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Leaderboard Table ── */}
      <section className="space-y-2">
        <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-500">All Teams</h3>
        {!team.hackathon.publishLeaderboard ? (
          <div className="border border-zinc-300 bg-white p-12 text-center rounded-none shadow-sm max-w-xl mx-auto space-y-4">
            <Trophy className="w-10 h-10 text-zinc-300 mx-auto" strokeWidth={1.5} />
            <h3 className="text-sm font-bold text-zinc-900">Leaderboard Coming Soon</h3>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-xs mx-auto">
              Evaluation is currently underway. Standings will be published here live once finalized by moderators.
            </p>
          </div>
        ) : (
          <div className="border border-zinc-300 overflow-x-auto shadow-sm">
            <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-zinc-105 text-zinc-700 border-b border-zinc-300">
                <th className="text-left text-[10px] font-extrabold uppercase tracking-widest px-5 py-3.5 w-14 border-r border-zinc-200">#</th>
                <th className="text-left text-[10px] font-extrabold uppercase tracking-widest px-5 py-3.5 border-r border-zinc-200">Team</th>
                <th className="text-left text-[10px] font-extrabold uppercase tracking-widest px-5 py-3.5 border-r border-zinc-200">TL</th>
                <th className="text-left text-[10px] font-extrabold uppercase tracking-widest px-5 py-3.5 border-r border-zinc-200 w-24">Rank</th>
                <th className="text-left text-[10px] font-extrabold uppercase tracking-widest px-5 py-3.5 border-r border-zinc-200 w-24">Level</th>
                <th className="text-left text-[10px] font-extrabold uppercase tracking-widest px-5 py-3.5 w-48">Score</th>
              </tr>
            </thead>
            <tbody>
              {ranked.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-14 text-zinc-400 text-xs bg-white">
                    No teams registered yet.
                  </td>
                </tr>
              ) : (
                ranked.map((row, idx) => {
                  const isMe = row.id === team.id;
                  const isEven = idx % 2 === 0;
                  const lvl = getLevel(row.score);
                  const pct = row.score > 0 ? Math.round((row.score / maxScore) * 100) : 0;

                  return (
                    <tr
                      key={row.id}
                      className={`border-b border-zinc-200 last:border-0 transition-colors bg-white hover:bg-zinc-50 ${
                        isMe ? "bg-red-50" : ""
                      }`}
                    >
                      {/* # */}
                      <td className="px-5 py-4 border-r border-zinc-200">
                        <span className={`text-xs font-bold ${isMe ? "text-[#E61E32]" : "text-zinc-400"}`}>
                          {idx + 1}
                        </span>
                      </td>

                      {/* Team */}
                      <td className="px-5 py-4 border-r border-zinc-200">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 flex items-center justify-center overflow-hidden shrink-0 ${
                            isMe ? "bg-[#E61E32] text-white" : "bg-zinc-200 text-zinc-600"
                          }`}>
                            {row.avatarUrl ? (
                              <img src={row.avatarUrl} alt="Avatar" className="w-full h-full object-contain" />
                            ) : (
                              row.teamName.charAt(0)
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-zinc-900">{row.teamName}</span>
                              {isMe && (
                                <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#E61E32] border border-red-200 bg-red-50 px-1.5 py-0.5">
                                  You
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-zinc-400 mt-0.5">{row._count.members + 1} members</p>
                          </div>
                        </div>
                      </td>

                      {/* TL */}
                      <td className="px-5 py-4 text-xs font-medium text-zinc-600 border-r border-zinc-200">
                        {row.teamLeadName}
                      </td>

                      {/* Rank badge */}
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
                          <span className={`text-sm font-extrabold tabular-nums w-14 shrink-0 ${row.score > 0 ? "text-zinc-900" : "text-zinc-300"}`}>
                            {row.score > 0 ? row.score.toLocaleString() : "—"}
                          </span>
                          {row.score > 0 && (
                            <div className="flex-1 h-1.5 bg-zinc-200 overflow-hidden min-w-[60px]">
                              <div
                                className={`h-full ${isMe ? "bg-[#E61E32]" : "bg-zinc-500"}`}
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
          <div className="bg-zinc-50 border-t border-zinc-200 px-5 py-2.5 flex justify-between items-center">
            <p className="text-[10px] text-zinc-400 font-semibold">
              {ranked.length} team{ranked.length !== 1 ? "s" : ""} · scores set by organizers
            </p>
            {myRow && (
              <p className="text-[10px] font-bold text-zinc-600">
                Your score: <span className={myRow.score > 0 ? "text-zinc-900" : "text-zinc-400"}>
                  {myRow.score > 0 ? `${myRow.score} pts` : "not scored yet"}
                </span>
              </p>
            )}
          </div>
        </div>
      )}
      </section>

      {/* ── Team Members Table ── */}
      <section className="space-y-2">
        <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-500">
          {team.teamName} — Members
        </h3>
        <div className="border border-zinc-300 overflow-x-auto shadow-sm">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-zinc-105 text-zinc-700 border-b border-zinc-300">
                <th className="text-left text-[10px] font-extrabold uppercase tracking-widest px-5 py-3.5 w-14 border-r border-zinc-200">#</th>
                <th className="text-left text-[10px] font-extrabold uppercase tracking-widest px-5 py-3.5 border-r border-zinc-200">Name</th>
                <th className="text-left text-[10px] font-extrabold uppercase tracking-widest px-5 py-3.5 border-r border-zinc-200">Email</th>
                <th className="text-left text-[10px] font-extrabold uppercase tracking-widest px-5 py-3.5 w-28">Role</th>
              </tr>
            </thead>
            <tbody>
              {/* Lead */}
              <tr className="border-b border-zinc-200 bg-red-50">
                <td className="px-5 py-4 text-xs font-bold text-[#E61E32] border-r border-zinc-200">1</td>
                <td className="px-5 py-4 border-r border-zinc-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 overflow-hidden bg-[#E61E32] text-white flex items-center justify-center text-xs font-extrabold uppercase shrink-0">
                      {team.avatarUrl ? (
                        <img src={team.avatarUrl} alt="Avatar" className="w-full h-full object-contain" />
                      ) : (
                        team.teamLeadName.charAt(0)
                      )}
                    </div>
                    <span className="text-sm font-bold text-zinc-900">{team.teamLeadName}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-xs text-zinc-500 border-r border-zinc-200">{team.email}</td>
                <td className="px-5 py-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#E61E32] border border-red-200 bg-red-50 px-2.5 py-0.5">
                    TL
                  </span>
                </td>
              </tr>

              {teamMembers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-zinc-400 text-xs bg-white">
                    No additional members yet.
                  </td>
                </tr>
              ) : (
                teamMembers.map((m, idx) => {
                  const isEven = (idx + 1) % 2 === 0;
                  return (
                    <tr
                      key={m.id}
                      className="border-b border-zinc-200 last:border-0 transition-colors bg-white hover:bg-zinc-50"
                    >
                      <td className="px-5 py-4 text-xs font-bold text-zinc-400 border-r border-zinc-200">{idx + 2}</td>
                      <td className="px-5 py-4 border-r border-zinc-200">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 overflow-hidden bg-zinc-200 border border-zinc-300 flex items-center justify-center text-xs font-extrabold text-zinc-600 uppercase shrink-0">
                            {m.avatarUrl ? (
                              <img src={m.avatarUrl} alt="Avatar" className="w-full h-full object-contain" />
                            ) : (
                              m.fullName.charAt(0)
                            )}
                          </div>
                          <span className="text-sm font-semibold text-zinc-900">{m.fullName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-zinc-500 border-r border-zinc-200">{m.email}</td>
                      <td className="px-5 py-4">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 border border-zinc-200 bg-zinc-50 px-2.5 py-0.5">
                          Member
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          <div className="bg-zinc-50 border-t border-zinc-200 px-5 py-2.5">
            <p className="text-[10px] text-zinc-400 font-semibold">
              {teamMembers.length + 1} member{teamMembers.length + 1 !== 1 ? "s" : ""} total on {team.teamName}
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}
