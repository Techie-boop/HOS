"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateTeamScoreAction, togglePublishLeaderboardAction } from "../../../actions/leaderboard-actions";
import { Loader2, ExternalLink, ShieldAlert, Check } from "lucide-react";
import Link from "next/link";

interface TeamRow {
  id: string;
  teamName: string;
  teamLeadName: string;
  score: number;
}

interface HackathonInfo {
  id: string;
  title: string;
  publishLeaderboard: boolean;
  teams: TeamRow[];
}

interface Props {
  hackathons: HackathonInfo[];
}

export default function LeaderboardManager({ hackathons }: Props) {
  const router = useRouter();
  const [activeHackathonId, setActiveHackathonId] = useState<string>(hackathons[0]?.id || "");
  const [scores, setScores] = useState<Record<string, number>>({});
  const [savingTeamId, setSavingTeamId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const activeHackathon = hackathons.find((h) => h.id === activeHackathonId);
  const teams = activeHackathon?.teams || [];
  const isPublished = activeHackathon?.publishLeaderboard || false;

  const handleScoreChange = (teamId: string, val: string) => {
    const num = parseInt(val) || 0;
    setScores((prev) => ({ ...prev, [teamId]: num }));
  };

  const saveScore = (teamId: string, currentScore: number) => {
    const newScore = teamId in scores ? scores[teamId] : currentScore;
    setSavingTeamId(teamId);
    startTransition(async () => {
      try {
        const res = await updateTeamScoreAction(teamId, newScore);
        if (res.success) {
          router.refresh();
        }
      } catch (err) {
        console.error(err);
      } finally {
        setSavingTeamId(null);
      }
    });
  };

  const handlePublishToggle = () => {
    if (!activeHackathonId) return;
    startTransition(async () => {
      try {
        const res = await togglePublishLeaderboardAction(activeHackathonId, !isPublished);
        if (res.success) {
          router.refresh();
        }
      } catch (err) {
        console.error(err);
      }
    });
  };

  if (hackathons.length === 0) {
    return (
      <div className="border border-zinc-200 bg-white p-8 text-center rounded-none max-w-xl mx-auto mt-8">
        <p className="text-zinc-500 text-sm font-semibold">No active hackathons found. Please configure a hackathon first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Configuration bar */}
      <div className="bg-white border border-zinc-300 rounded-none p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        
        {/* Selector */}
        <div className="space-y-1.5 w-full md:w-auto">
          <label className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 block">
            Select Hackathon
          </label>
          <select
            value={activeHackathonId}
            onChange={(e) => setActiveHackathonId(e.target.value)}
            className="w-full md:w-64 border border-zinc-300 rounded-none p-2 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-zinc-400 bg-white"
          >
            {hackathons.map((h) => (
              <option key={h.id} value={h.id}>
                {h.title}
              </option>
            ))}
          </select>
        </div>

        {/* Action group */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap pt-2 md:pt-0">
          
          {/* View Live Leaderboard Button */}
          <Link
            href={`/leaderboard/${activeHackathonId}`}
            target="_blank"
            className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold px-4 py-2.5 rounded-none transition-all shadow-sm cursor-pointer"
          >
            View Live Leaderboard
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {/* Publish / Unpublish Toggle */}
          <button
            type="button"
            disabled={isPending}
            onClick={handlePublishToggle}
            className={`text-xs font-bold px-4 py-2.5 rounded-none transition-all border cursor-pointer ${
              isPublished
                ? "bg-red-50 text-[#E61E32] border-red-200 hover:bg-red-100/50"
                : "bg-[#E61E32] hover:bg-[#c91527] text-white border-transparent"
            }`}
          >
            {isPending ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="w-3 h-3 animate-spin" /> Processing...
              </span>
            ) : isPublished ? (
              "Unpublish Leaderboard"
            ) : (
              "Publish Leaderboard"
            )}
          </button>

        </div>
      </div>

      {/* Visibility Status Alert */}
      <div className={`p-4 border rounded-none flex items-start gap-3 ${
        isPublished
          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
          : "bg-amber-50 border-amber-200 text-amber-800"
      }`}>
        <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
        <div className="space-y-0.5">
          <p className="text-xs font-bold">
            {isPublished ? "Leaderboard is Public & Live" : "Leaderboard is Private / Draft"}
          </p>
          <p className="text-[11px] opacity-90 leading-relaxed font-medium">
            {isPublished
              ? "All participants and teams can view current rankings inside their consoles and via the public live page."
              : "Rankings are hidden from the participant consoles. Teams will see 'Coming Soon' until published."}
          </p>
        </div>
      </div>

      {/* Teams list & score editor */}
      <section className="space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-500">
          Rankings & Score Editor
        </h3>
        
        <div className="border border-zinc-300 overflow-x-auto shadow-sm">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-zinc-100 text-zinc-700 border-b border-zinc-300">
                <th className="text-left text-[10px] font-extrabold uppercase tracking-widest px-5 py-3.5 w-14 border-r border-zinc-200">#</th>
                <th className="text-left text-[10px] font-extrabold uppercase tracking-widest px-5 py-3.5 border-r border-zinc-200">Team Name</th>
                <th className="text-left text-[10px] font-extrabold uppercase tracking-widest px-5 py-3.5 border-r border-zinc-200">TL</th>
                <th className="text-right text-[10px] font-extrabold uppercase tracking-widest px-5 py-3.5 w-40 border-r border-zinc-200">Current Score</th>
                <th className="text-left text-[10px] font-extrabold uppercase tracking-widest px-5 py-3.5 w-48">Edit Score</th>
              </tr>
            </thead>
            <tbody>
              {teams.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-zinc-400 text-xs bg-white">
                    No registered teams found for this hackathon.
                  </td>
                </tr>
              ) : (
                teams.map((t, idx) => {
                  const val = t.id in scores ? scores[t.id].toString() : t.score.toString();
                  const isSaving = savingTeamId === t.id;

                  return (
                    <tr
                      key={t.id}
                      className="border-b border-zinc-200 last:border-0 transition-colors bg-white hover:bg-zinc-50/60"
                    >
                      {/* # */}
                      <td className="px-5 py-4 text-xs font-bold text-zinc-400 border-r border-zinc-200">
                        {idx + 1}
                      </td>

                      {/* Team Name */}
                      <td className="px-5 py-4 border-r border-zinc-200 font-bold text-zinc-900">
                        {t.teamName}
                      </td>

                      {/* TL */}
                      <td className="px-5 py-4 text-xs font-semibold text-zinc-650 border-r border-zinc-200">
                        {t.teamLeadName}
                      </td>

                      {/* Current Score */}
                      <td className="px-5 py-4 text-right font-extrabold text-sm text-zinc-900 border-r border-zinc-200 tabular-nums">
                        {t.score.toLocaleString()}
                        <span className="text-[10px] text-zinc-400 ml-1">pts</span>
                      </td>

                      {/* Edit Input + Save */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={val}
                            onChange={(e) => handleScoreChange(t.id, e.target.value)}
                            className="w-24 border border-zinc-300 rounded-none px-2 py-1 text-xs font-bold focus:outline-none focus:border-zinc-500 bg-white"
                          />
                          <button
                            type="button"
                            disabled={isSaving}
                            onClick={() => saveScore(t.id, t.score)}
                            className="bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-none transition-colors cursor-pointer flex items-center gap-1"
                          >
                            {isSaving ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <>
                                <Check className="w-3 h-3" strokeWidth={2.5} /> Save
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Footer banner */}
          <div className="bg-zinc-50 border-t border-zinc-200 px-5 py-2.5">
            <p className="text-[10px] text-zinc-400 font-semibold">
              Scores updated here will sync to the team leaderboard consoles instantly upon saving.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
