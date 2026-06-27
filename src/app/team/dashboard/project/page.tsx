import { getSessionTeam } from "../../../../lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "../../../../lib/db";
import ProjectSubmissionForm from "./ProjectSubmissionForm";

export default async function TeamProjectPage() {
  const team = await getSessionTeam();
  if (!team) redirect("/team/login");

  const submission = await prisma.projectSubmission.findUnique({
    where: { teamId: team.id },
  });

  return (
    <main className="flex-grow p-6 md:p-10 max-w-[1400px] w-full space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">Project Submission</h2>
        <p className="text-sm text-zinc-500 mt-1">
          Submit your GitHub repository and live deployment link for{" "}
          <span className="font-semibold text-zinc-700">{team.hackathon.title}</span>
        </p>
      </div>

      {/* Requirements strip */}
      <div className="flex flex-wrap items-center gap-0 border border-zinc-200 bg-white divide-x divide-zinc-200 w-fit">
        {[
          { label: "Public GitHub repository", required: true },
          { label: "Live deployment URL", required: false },
          { label: "Project name & description", required: false },
        ].map(({ label, required }) => (
          <div key={label} className="flex items-center gap-2 px-4 py-2.5">
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                required ? "bg-[#E61E32]" : "bg-zinc-400"
              }`}
            />
            <span className="text-[11px] font-semibold text-zinc-600">{label}</span>
            {required ? (
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#E61E32]">Required</span>
            ) : (
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-zinc-400">Optional</span>
            )}
          </div>
        ))}
      </div>

      {/* Form / Receipt */}
      <ProjectSubmissionForm
        teamId={team.id}
        hackathonId={team.hackathonId}
        hackathonTitle={team.hackathon.title}
        initialSubmission={submission}
      />
    </main>
  );
}
