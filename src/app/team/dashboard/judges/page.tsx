import { getSessionTeam } from "../../../../lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "../../../../lib/db";
import { Award, User, Shield, HelpCircle } from "lucide-react";

export default async function TeamJudgesPage() {
  const team = await getSessionTeam();
  if (!team) redirect("/team/login");

  // Fetch judges registered for this hackathon
  const judges = await prisma.judge.findMany({
    where: { hackathonId: team.hackathonId },
    orderBy: { name: "asc" },
  });

  // Fetch guidelines defined for this hackathon
  const guidelines = await prisma.judgingGuideline.findMany({
    where: { hackathonId: team.hackathonId },
    orderBy: { createdAt: "asc" },
  });

  return (
    <main className="flex-grow p-6 md:p-8 max-w-[1400px] w-full space-y-8 animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">Judging Panels & Guidelines</h2>
        <p className="text-sm text-zinc-500">
          Introductions to evaluation experts and guidelines for {team.hackathon.title}
        </p>
      </div>

      {/* ── Section 1: Evaluation Panels ── */}
      <section className="space-y-4">
        <h3 className="text-sm font-extrabold uppercase text-zinc-500 tracking-wider">
          Evaluation Panels
        </h3>

        {judges.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {judges.map((jd) => (
              <div
                key={jd.id}
                className="bg-zinc-50/50 border border-zinc-200/80 border-l-4 border-l-[#E61E32] rounded-r-lg rounded-l-sm p-4 shadow-sm flex items-start gap-4 transition-all duration-200 hover:shadow-md"
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-zinc-200 border border-zinc-300 flex items-center justify-center text-zinc-600 font-bold text-sm shrink-0 uppercase overflow-hidden">
                  {jd.imageUrl ? (
                    <img src={jd.imageUrl} alt={jd.name} className="w-full h-full object-cover" />
                  ) : (
                    jd.name.charAt(0)
                  )}
                </div>

                {/* Details */}
                <div className="space-y-1 min-w-0">
                  <h4 className="text-sm font-bold text-zinc-950 leading-snug truncate">{jd.name}</h4>
                  <p className="text-xs text-zinc-600 font-normal leading-relaxed">{jd.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-zinc-200 rounded-lg p-10 text-center text-zinc-450 shadow-sm">
            <User className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
            <p className="text-xs font-semibold">Jury members pending</p>
            <p className="text-[10px] text-zinc-400 mt-1">
              Introductions to evaluation experts will be posted before the submission round.
            </p>
          </div>
        )}
      </section>

      {/* ── Section 2: How Judging Works — appears directly below panels ── */}
      <section className="space-y-4">
        <h3 className="text-sm font-extrabold uppercase text-zinc-500 tracking-wider">
          How Judging Works
        </h3>

        <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
          {/* Header stripe */}
          <div className="bg-zinc-50 border-b border-zinc-200 px-5 py-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-[#E61E32]" strokeWidth={2.5} />
            <span className="text-xs font-extrabold uppercase text-zinc-700 tracking-wider">
              Evaluation Rubrics
            </span>
          </div>

          <div className="p-5">
            {guidelines.length > 0 ? (
              <ul className="space-y-3">
                {guidelines.map((g, idx) => (
                  <li
                    key={g.id}
                    className="flex items-start gap-3 text-xs text-zinc-700 leading-relaxed bg-zinc-50 border border-zinc-200/60 rounded-lg p-3"
                  >
                    {/* Index badge */}
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-50 border border-red-100 text-[#E61E32] font-bold text-[10px] flex items-center justify-center mt-0.5">
                      {idx + 1}
                    </span>
                    <Shield className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                    <span>{g.content}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-zinc-450">
                <HelpCircle className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                <p className="text-xs font-semibold">No rubrics specified yet</p>
                <p className="text-[10px] text-zinc-400 mt-1">
                  Rubrics and submission criteria are set by event organizers.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
