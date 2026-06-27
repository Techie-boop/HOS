import { getSessionTeam } from "../../../../lib/auth";
import { redirect } from "next/navigation";
import { FileBadge, Clock, Award, ShieldCheck } from "lucide-react";

export default async function TeamCertificatesPage() {
  const team = await getSessionTeam();
  if (!team) redirect("/team/login");

  return (
    <main className="flex-grow p-6 md:p-8 max-w-[1400px] w-full space-y-6 animate-in fade-in duration-200">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">Certificates</h2>
        <p className="text-sm text-zinc-500 mt-1">
          Verified credentials for <span className="font-semibold text-zinc-700">{team.hackathon.title}</span>
        </p>
      </div>

      {/* Coming Soon card */}
      <div className="border border-zinc-200 bg-white max-w-xl">

        <div className="px-8 py-12 flex flex-col items-start gap-6">
          {/* Icon + badge */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 border border-zinc-200 bg-zinc-50 flex items-center justify-center">
              <FileBadge className="w-6 h-6 text-zinc-400" strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 flex items-center gap-1.5">
              <Clock className="w-3 h-3" strokeWidth={2.5} />
              Coming Soon
            </span>
          </div>

          {/* Text */}
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-zinc-900">Certificates Not Yet Available</h3>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-sm">
              Your participation and achievement certificates will be generated and published here once the hackathon concludes and evaluations are complete.
            </p>
          </div>

          {/* What to expect */}
          <div className="space-y-2 w-full border-t border-zinc-100 pt-5">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">What you'll receive</p>
            <ul className="space-y-2">
              {[
                { icon: ShieldCheck, label: "Participation Certificate", desc: "For all registered team members" },
                { icon: Award,       label: "Achievement Certificate",   desc: "For top-ranking and prize-winning teams" },
              ].map(({ icon: Icon, label, desc }) => (
                <li key={label} className="flex items-start gap-3">
                  <Icon className="w-4 h-4 text-zinc-300 mt-0.5 shrink-0" strokeWidth={2} />
                  <div>
                    <p className="text-xs font-semibold text-zinc-600">{label}</p>
                    <p className="text-[10px] text-zinc-400">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

    </main>
  );
}
