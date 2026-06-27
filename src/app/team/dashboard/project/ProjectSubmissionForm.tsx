"use client";

import { useState, useTransition } from "react";
import { submitProject } from "../../../actions/submission-actions";
import {
  GitBranch,
  Globe,
  UploadCloud,
  CheckCircle2,
  Loader2,
  ExternalLink,
  Clock,
  RefreshCw,
} from "lucide-react";

interface Submission {
  id: string;
  githubUrl: string;
  liveUrl: string | null;
  projectName: string | null;
  description: string | null;
  submittedAt: Date;
  updatedAt: Date;
}

interface Props {
  teamId: string;
  hackathonId: string;
  hackathonTitle: string;
  initialSubmission: Submission | null;
}

export default function ProjectSubmissionForm({
  teamId,
  hackathonId,
  hackathonTitle,
  initialSubmission,
}: Props) {
  const [submission, setSubmission] = useState<Submission | null>(initialSubmission);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    data.set("teamId", teamId);
    data.set("hackathonId", hackathonId);

    startTransition(async () => {
      try {
        await submitProject(data);
        // Re-fetch optimistically from form data
        setSubmission({
          id: submission?.id ?? "new",
          githubUrl: data.get("githubUrl") as string,
          liveUrl: (data.get("liveUrl") as string) || null,
          projectName: (data.get("projectName") as string) || null,
          description: (data.get("description") as string) || null,
          submittedAt: submission?.submittedAt ?? new Date(),
          updatedAt: new Date(),
        });
        setEditing(false);
      } catch (err: any) {
        setError(err.message ?? "Submission failed. Please try again.");
      }
    });
  };

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en-IN", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(new Date(date));

  // ── SUBMITTED STATE ──
  if (submission && !editing) {
    return (
      <div className="max-w-2xl space-y-3">
        {/* Success Banner */}
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 border-l-4 border-l-emerald-500 px-5 py-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="text-sm font-bold text-emerald-800">Project Submitted Successfully</p>
            <p className="text-xs text-emerald-600 mt-0.5">
              Your project has been registered for <span className="font-semibold">{hackathonTitle}</span>.
            </p>
          </div>
        </div>

        {/* Submission Card */}
        <div className="bg-white border border-zinc-200 shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="bg-zinc-50 border-b border-zinc-200 px-6 py-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-[#E61E32]" strokeWidth={2.5} />
              <span className="text-xs font-extrabold uppercase text-zinc-700 tracking-wider">
                Submission Receipt
              </span>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-800 border border-zinc-200 hover:border-zinc-300 bg-white hover:bg-zinc-50 px-2.5 py-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              Update
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Project Name */}
            {submission.projectName && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Project Name</p>
                <p className="text-base font-bold text-zinc-900">{submission.projectName}</p>
              </div>
            )}

            {/* Description */}
            {submission.description && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Description</p>
                <p className="text-sm text-zinc-600 leading-relaxed">{submission.description}</p>
              </div>
            )}

            {/* Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={submission.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-zinc-950 hover:bg-zinc-800 text-white px-4 py-3 transition-colors group"
              >
                <GitBranch className="w-4 h-4 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-300">
                    GitHub Repository
                  </p>
                  <p className="text-xs font-semibold truncate mt-0.5">{submission.githubUrl}</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              </a>

              {submission.liveUrl ? (
                <a
                  href={submission.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-sky-950 hover:bg-sky-900 text-white px-4 py-3 transition-colors group"
                >
                  <Globe className="w-4 h-4 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-sky-400 group-hover:text-sky-300">
                      Live Deployment
                    </p>
                    <p className="text-xs font-semibold truncate mt-0.5">{submission.liveUrl}</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                </a>
              ) : (
                <div className="flex items-center gap-3 bg-zinc-100 border border-zinc-200 border-dashed px-4 py-3">
                  <Globe className="w-4 h-4 text-zinc-300 shrink-0" />
                  <p className="text-xs text-zinc-400 font-medium">No live deployment added</p>
                </div>
              )}
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-100">
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-zinc-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Submitted At</p>
                  <p className="text-xs font-semibold text-zinc-700 mt-0.5">{formatDate(submission.submittedAt)}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-zinc-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Last Updated</p>
                  <p className="text-xs font-semibold text-zinc-700 mt-0.5">{formatDate(submission.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── FORM STATE ──
  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 shadow-sm overflow-hidden">
        {/* Form Header */}
        <div className="bg-gradient-to-r from-[#E61E32] to-[#c91527] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/15 rounded-lg flex items-center justify-center">
              <UploadCloud className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {editing ? "Update Submission" : "Submit Your Project"}
              </h3>
              <p className="text-red-100 text-xs mt-0.5">{hackathonTitle}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Project Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500" htmlFor="projectName">
              Project Name
            </label>
            <input
              id="projectName"
              name="projectName"
              type="text"
              placeholder="e.g. AquaTrack — Water Quality Monitor"
              defaultValue={submission?.projectName ?? ""}
              className="w-full bg-zinc-50 border border-zinc-200 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#E61E32]/30 focus:border-[#E61E32] transition"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500" htmlFor="description">
              Short Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Briefly describe what your project does and the problem it solves…"
              defaultValue={submission?.description ?? ""}
              className="w-full bg-zinc-50 border border-zinc-200 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#E61E32]/30 focus:border-[#E61E32] transition resize-none"
            />
          </div>

          {/* GitHub URL */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500" htmlFor="githubUrl">
              GitHub Repository URL <span className="text-[#E61E32]">*</span>
            </label>
            <div className="relative">
              <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                id="githubUrl"
                name="githubUrl"
                type="url"
                required
                placeholder="https://github.com/your-org/your-repo"
                defaultValue={submission?.githubUrl ?? ""}
                className="w-full bg-zinc-50 border border-zinc-200 pl-10 pr-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#E61E32]/30 focus:border-[#E61E32] transition"
              />
            </div>
            <p className="text-[10px] text-zinc-400">Must be a public repository accessible to judges.</p>
          </div>

          {/* Live URL */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500" htmlFor="liveUrl">
              Live Deployment URL <span className="text-zinc-400 font-normal normal-case text-[10px]">(optional)</span>
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                id="liveUrl"
                name="liveUrl"
                type="url"
                placeholder="https://your-project.vercel.app"
                defaultValue={submission?.liveUrl ?? ""}
                className="w-full bg-zinc-50 border border-zinc-200 pl-10 pr-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#E61E32]/30 focus:border-[#E61E32] transition"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs font-semibold text-[#E61E32] bg-red-50 border border-red-200 px-4 py-2.5">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 bg-[#E61E32] hover:bg-[#c91527] disabled:opacity-60 text-white font-bold py-2.5 px-6 text-sm transition-colors cursor-pointer shadow-sm"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UploadCloud className="w-4 h-4" />
              )}
              {isPending ? "Submitting…" : editing ? "Update Submission" : "Submit Project"}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="text-sm font-semibold text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
