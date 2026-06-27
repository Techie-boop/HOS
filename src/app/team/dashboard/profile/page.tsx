import { getSessionTeam, getSessionTeamId } from "../../../../lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "../../../../lib/db";
import { Calendar, User, Users } from "lucide-react";
import AvatarSelector from "./AvatarSelector";

export default async function TeamProfilePage() {
  const team = await getSessionTeam();
  const sessionUserId = await getSessionTeamId();

  if (!team || !sessionUserId) {
    redirect("/team/login");
  }

  const teamMembers = await prisma.teamMember.findMany({
    where: { teamId: team.id },
    select: { id: true, fullName: true, email: true, avatarUrl: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const totalMembers = teamMembers.length + 1;

  const joinedDate = new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(
    new Date(team.createdAt)
  );

  return (
    <main className="flex-grow p-6 md:p-8 max-w-[1400px] w-full space-y-6 animate-in fade-in duration-200">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">Profile</h2>
        <p className="text-sm text-zinc-500 mt-1">Your account and team details</p>
      </div>

      {/* Avatar Picker Component */}
      <AvatarSelector
        sessionUserId={sessionUserId}
        isLead={team.isLead}
        currentAvatar={team.user.avatarUrl}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left: Avatar card ── */}
        <div className="bg-white border border-zinc-300 shadow-sm p-6 flex flex-col gap-4">
          {/* Avatar display */}
          <div className="w-16 h-16 bg-zinc-950 flex items-center justify-center overflow-hidden shrink-0">
            {team.user.avatarUrl ? (
              <img src={team.user.avatarUrl} alt="Avatar" className="w-full h-full object-contain" />
            ) : (
              <span className="text-2xl font-extrabold text-white uppercase">
                {team.user.fullName.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <p className="text-base font-bold text-zinc-900">{team.user.fullName}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{team.user.email}</p>
          </div>
          <span className={`w-fit text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 border ${
            team.isLead
              ? "text-[#E61E32] bg-red-50 border-red-200"
              : "text-zinc-500 bg-zinc-50 border-zinc-200"
          }`}>
            {team.isLead ? "Team Lead" : "Member"}
          </span>
          <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-semibold pt-4 border-t border-zinc-100 mt-auto">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            Team created {joinedDate}
          </div>
        </div>

        {/* ── Right: Tables ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Account Information table */}
          <section className="space-y-2">
            <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-500">
              Account Information
            </h3>
            <div className="border border-zinc-300 overflow-hidden shadow-sm">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-zinc-50 text-zinc-700 border-b border-zinc-300">
                    <th className="text-left text-[10px] font-extrabold uppercase tracking-widest px-5 py-3.5 w-40 border-r border-zinc-200">
                      Field
                    </th>
                    <th className="text-left text-[10px] font-extrabold uppercase tracking-widest px-5 py-3.5">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { field: "Full Name",     value: team.user.fullName },
                    { field: "Email Address", value: team.user.email },
                    { field: "Console Role",  value: team.isLead ? "Team Lead (Admin)" : "Teammate", highlight: true },
                    { field: "Team Name",     value: team.teamName },
                    { field: "Hackathon",     value: team.hackathon.title },
                    { field: "Join Code",     value: team.joinCode, mono: true },
                    { field: "Total Members", value: `${totalMembers} member${totalMembers !== 1 ? "s" : ""}` },
                  ].map(({ field, value, highlight, mono }, idx) => (
                    <tr
                      key={field}
                      className="border-b border-zinc-200 last:border-0 bg-white hover:bg-zinc-50 transition-colors"
                    >
                      <td className="px-5 py-3.5 border-r border-zinc-200">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">
                          {field}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {highlight ? (
                          <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 border ${
                            team.isLead
                              ? "text-[#E61E32] bg-red-50 border-red-200"
                              : "text-zinc-500 bg-zinc-50 border-zinc-200"
                          }`}>
                            {value}
                          </span>
                        ) : mono ? (
                          <span className="font-mono text-sm font-bold text-zinc-900 bg-zinc-100 border border-zinc-200 px-2 py-0.5 tracking-widest">
                            {value}
                          </span>
                        ) : (
                          <span className="text-sm font-semibold text-zinc-900">{value}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Members table */}
          <section className="space-y-2">
            <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-500">
              {team.teamName} — Members
            </h3>
            <div className="border border-zinc-300 overflow-hidden shadow-sm">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-zinc-50 text-zinc-700 border-b border-zinc-300">
                    <th className="text-left text-[10px] font-extrabold uppercase tracking-widest px-5 py-3.5 w-14 border-r border-zinc-200">#</th>
                    <th className="text-left text-[10px] font-extrabold uppercase tracking-widest px-5 py-3.5 border-r border-zinc-200">Name</th>
                    <th className="text-left text-[10px] font-extrabold uppercase tracking-widest px-5 py-3.5 border-r border-zinc-200">Email</th>
                    <th className="text-left text-[10px] font-extrabold uppercase tracking-widest px-5 py-3.5 w-28">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Lead row */}
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
                  {totalMembers} member{totalMembers !== 1 ? "s" : ""} on {team.teamName}
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
