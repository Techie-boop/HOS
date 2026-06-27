import { getSessionUser } from "../../../../lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "../../../../lib/db";
import {
  GitBranch,
  Globe,
  ExternalLink,
  Clock,
  UploadCloud,
  Users,
  RefreshCw,
} from "lucide-react";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export default async function OrganizerSubmissionsPage() {
  const organizer = await getSessionUser();
  if (!organizer) redirect("/sign-in");

  // Get all hackathons belonging to this organizer
  const hackathons = await prisma.hackathon.findMany({
    where: { organizerId: organizer.id },
    select: { id: true, title: true },
    orderBy: { createdAt: "desc" },
  });

  const hackathonIds = hackathons.map((h) => h.id);

  // Fetch all submissions across organizer's hackathons
  const submissions = await prisma.projectSubmission.findMany({
    where: { hackathonId: { in: hackathonIds } },
    include: {
      team: { select: { teamName: true, teamLeadName: true, email: true } },
      hackathon: { select: { title: true } },
    },
    orderBy: { submittedAt: "desc" },
  });

  return (
    <main className="p-6 md:p-8 w-full space-y-6 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Project Submissions</h2>
          <p className="text-sm text-zinc-500 mt-1">
            All project submissions across your hosted hackathons
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-zinc-300 rounded-none px-4 py-2 text-xs font-bold text-zinc-650 shadow-sm shrink-0 self-start sm:self-auto">
          <UploadCloud className="w-4 h-4 text-[#E61E32]" strokeWidth={2.5} />
          {submissions.length} Submission{submissions.length !== 1 ? "s" : ""}
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="bg-white border border-zinc-300 rounded-none p-16 text-center shadow-sm">
          <UploadCloud className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
          <p className="text-xs font-bold text-zinc-500">No submissions yet</p>
          <p className="text-[11px] text-zinc-400 mt-1">
            Team submissions will appear here once teams begin submitting their projects.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 max-w-6xl">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="bg-white border border-zinc-300 border-l-4 border-l-[#E61E32] rounded-none shadow-sm overflow-hidden hover:border-zinc-450 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Card Header */}
                <div className="px-5 py-3 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <Users className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="text-xs font-bold text-zinc-800 truncate">
                      {sub.team.teamName}
                    </span>
                    <span className="text-zinc-300 text-xs">·</span>
                    <span className="text-[10px] text-zinc-400 truncate">
                      {sub.hackathon.title}
                    </span>
                  </div>
                  <span className="shrink-0 text-[9px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-250 rounded-none px-2.5 py-0.5">
                    Submitted
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  {/* Project name & description */}
                  {sub.projectName && (
                    <div>
                      <p className="text-sm font-bold text-zinc-900">{sub.projectName}</p>
                      {sub.description && (
                        <p className="text-xs text-zinc-500 mt-1 leading-relaxed line-clamp-2">
                          {sub.description}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Team info */}
                  <div className="grid grid-cols-2 gap-2 border-t border-b border-zinc-100 py-3">
                    <div>
                      <p className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-400">Team Lead</p>
                      <p className="text-xs font-semibold text-zinc-700 mt-0.5">{sub.team.teamLeadName}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-400">Contact</p>
                      <p className="text-xs font-semibold text-zinc-700 mt-0.5 truncate">{sub.team.email}</p>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={sub.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-none px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <GitBranch className="w-3.5 h-3.5" />
                      GitHub Repo
                      <ExternalLink className="w-2.5 h-2.5 text-zinc-450" />
                    </a>
                    {sub.liveUrl && (
                      <a
                        href={sub.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-zinc-105 border border-zinc-300 hover:bg-zinc-200 text-zinc-800 rounded-none px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Globe className="w-3.5 h-3.5 text-zinc-500" />
                        Live Demo
                        <ExternalLink className="w-2.5 h-2.5 text-zinc-550" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="flex flex-wrap items-center gap-4 px-5 py-3 bg-zinc-50 border-t border-zinc-200 text-[10px] text-zinc-450 font-semibold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-zinc-400" />
                  Submitted: {formatDate(sub.submittedAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3 h-3 text-zinc-400" />
                  Updated: {formatDate(sub.updatedAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
