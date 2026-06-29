"use client";

import React, { useState, useTransition } from "react";
import { 
  addJudge, 
  deleteJudge, 
  addJudgingGuideline, 
  deleteJudgingGuideline,
  generateJudgeAccessCode 
} from "../../../actions/judging-actions";
import { 
  Trash2, 
  Shield, 
  Plus, 
  AlertCircle, 
  User, 
  Loader2, 
  Key, 
  Copy, 
  Check, 
  ExternalLink 
} from "lucide-react";

interface Hackathon {
  id: string;
  title: string;
}

interface Judge {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  loginCode: string | null;
  loginCodeExpiresAt: Date | null;
  hackathonId: string;
  hackathon: {
    title: string;
  };
}

interface Guideline {
  id: string;
  content: string;
  hackathonId: string;
  hackathon: {
    title: string;
  };
}

interface JudgingManagerProps {
  hackathons: Hackathon[];
  initialJudges: Judge[];
  initialGuidelines: Guideline[];
}

export default function JudgingManager({
  hackathons,
  initialJudges,
  initialGuidelines,
}: JudgingManagerProps) {
  const [selectedHackathonId, setSelectedHackathonId] = useState(hackathons[0]?.id || "");
  
  const filteredJudges = initialJudges.filter((jd) => jd.hackathonId === selectedHackathonId);
  const filteredGuidelines = initialGuidelines.filter((g) => g.hackathonId === selectedHackathonId);
  
  // Judge Form State
  const [judgeName, setJudgeName] = useState("");
  const [judgeDesc, setJudgeDesc] = useState("");
  const [judgeImg, setJudgeImg] = useState("");

  // Guideline Form State
  const [guidelineText, setGuidelineText] = useState("");

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleAddJudge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHackathonId || !judgeName.trim() || !judgeDesc.trim()) return;

    setMessage(null);
    startTransition(async () => {
      const res = await addJudge(selectedHackathonId, judgeName, judgeDesc, judgeImg);
      if (res.success) {
        setMessage({ type: "success", text: `Jury member "${judgeName}" added successfully!` });
        setJudgeName("");
        setJudgeDesc("");
        setJudgeImg("");
      } else {
        setMessage({ type: "error", text: res.error || "Failed to add jury member." });
      }
    });
  };

  const handleAddGuideline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHackathonId || !guidelineText.trim()) return;

    setMessage(null);
    startTransition(async () => {
      const res = await addJudgingGuideline(selectedHackathonId, guidelineText);
      if (res.success) {
        setMessage({ type: "success", text: "Judging guideline line added successfully!" });
        setGuidelineText("");
      } else {
        setMessage({ type: "error", text: res.error || "Failed to add guideline." });
      }
    });
  };

  const handleDeleteJudge = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove judge "${name}"?`)) return;

    startTransition(async () => {
      const res = await deleteJudge(id);
      if (res.success) {
        setMessage({ type: "success", text: "Judge removed successfully." });
      } else {
        setMessage({ type: "error", text: res.error || "Failed to remove judge." });
      }
    });
  };

  const handleDeleteGuideline = async (id: string) => {
    if (!confirm("Remove this guideline line?")) return;

    startTransition(async () => {
      const res = await deleteJudgingGuideline(id);
      if (res.success) {
        setMessage({ type: "success", text: "Guideline line removed." });
      } else {
        setMessage({ type: "error", text: res.error || "Failed to remove guideline." });
      }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Target Hackathon Selector */}
      <div className="bg-white border border-zinc-300 rounded-none p-5 shadow-sm max-w-xl">
        <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1.5">Configure Target Hackathon</label>
        {hackathons.length > 0 ? (
          <select
            value={selectedHackathonId}
            onChange={(e) => setSelectedHackathonId(e.target.value)}
            className="w-full bg-white border border-zinc-300 rounded-none px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:border-zinc-500 font-semibold"
          >
            {hackathons.map((h) => (
              <option key={h.id} value={h.id}>
                {h.title}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-xs text-amber-600 bg-amber-50 p-2.5 rounded-none border border-amber-200 font-semibold">
            Please create a hackathon first before setting up judging panels.
          </p>
        )}
      </div>

      {message && (
        <div
          className={`p-3 rounded-none text-xs font-semibold flex items-start gap-2 max-w-xl border ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-250 text-emerald-800"
              : "bg-red-50 border-red-250 text-red-800"
          }`}
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-current" />
          <span>{message.text}</span>
        </div>
      )}

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Form 1: Add Jures */}
        <div className="bg-white border border-zinc-300 rounded-none p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-200 pb-3">
            <User className="w-4 h-4 text-[#E61E32]" strokeWidth={2.5} />
            <h3 className="font-bold text-zinc-950 text-xs uppercase tracking-wider">Add Jury Member</h3>
          </div>

          <form onSubmit={handleAddJudge} className="space-y-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">Jury Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Sarah Connor"
                value={judgeName}
                onChange={(e) => setJudgeName(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded-none px-3 py-2 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">Jury Description / Bio</label>
              <textarea
                required
                placeholder="e.g. Lead AI Researcher at Skynet Labs. 10+ years in machine learning models."
                value={judgeDesc}
                onChange={(e) => setJudgeDesc(e.target.value)}
                rows={3}
                className="w-full bg-white border border-zinc-300 rounded-none px-3 py-2 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-zinc-500 resize-none"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">Jury Image URL (Optional)</label>
              <input
                type="url"
                placeholder="https://example.com/avatar.jpg"
                value={judgeImg}
                onChange={(e) => setJudgeImg(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded-none px-3 py-2 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <button
              type="submit"
              disabled={isPending || hackathons.length === 0}
              className="w-full bg-[#E61E32] hover:bg-[#c91527] disabled:bg-zinc-300 text-white py-2 rounded-none text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />} Add Jury Member
            </button>
          </form>
        </div>

        {/* Form 2: Add Judging Guidelines */}
        <div className="bg-white border border-zinc-300 rounded-none p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-200 pb-3">
            <Shield className="w-4 h-4 text-[#E61E32]" strokeWidth={2.5} />
            <h3 className="font-bold text-zinc-950 text-xs uppercase tracking-wider">Add Judging Guidelines</h3>
          </div>

          <form onSubmit={handleAddGuideline} className="space-y-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">Guideline Line</label>
              <textarea
                required
                placeholder="e.g. Originality & Innovation (25%): Does the project propose a fresh approach or novel application?"
                value={guidelineText}
                onChange={(e) => setGuidelineText(e.target.value)}
                rows={5}
                className="w-full bg-white border border-zinc-300 rounded-none px-3 py-2 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-zinc-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isPending || hackathons.length === 0}
              className="w-full bg-[#E61E32] hover:bg-[#c91527] disabled:bg-zinc-300 text-white py-2 rounded-none text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />} Add Guideline Line
            </button>
          </form>
        </div>

      </div>

      {/* Panels Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Panel 1: Juries Panel List */}
        <div className="space-y-3">
          <h3 className="font-bold text-zinc-550 text-xs uppercase tracking-wider">Configured Juries</h3>
          
          {filteredJudges.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredJudges.map((jd) => (
                <div
                  key={jd.id}
                  className="bg-white border border-zinc-300 border-l-4 border-l-[#E61E32] rounded-none p-4 shadow-sm flex flex-col justify-between relative group transition-all duration-200 hover:border-zinc-400"
                >
                  <button
                    onClick={() => handleDeleteJudge(jd.id, jd.name)}
                    className="absolute top-4 right-4 p-1.5 rounded-none border border-transparent hover:border-zinc-200 hover:bg-zinc-50 text-zinc-400 hover:text-red-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove judge"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-none bg-zinc-200 border border-zinc-300 flex items-center justify-center text-zinc-500 font-bold shrink-0 uppercase overflow-hidden">
                      {jd.imageUrl ? (
                        <img src={jd.imageUrl} alt={jd.name} className="w-full h-full object-cover" />
                      ) : (
                        jd.name.charAt(0)
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-zinc-950 pr-8">{jd.name}</h4>
                        <span className="text-[8px] font-extrabold text-[#E61E32] uppercase bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-none">
                          {jd.hackathon.title}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 font-normal leading-relaxed">{jd.description}</p>
                    </div>
                  </div>

                  {/* 5-Min Judge Login Access Code Generator */}
                  <JudgeAccessCodeSection 
                    judgeId={jd.id} 
                    initialCode={jd.loginCode} 
                    initialExpiry={jd.loginCodeExpiresAt} 
                  />

                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-dashed border-zinc-300 rounded-none p-10 text-center text-zinc-400 shadow-sm">
              <User className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
              <p className="text-xs font-semibold">No juries configured yet for this hackathon</p>
            </div>
          )}
        </div>

        {/* Panel 2: Guidelines List */}
        <div className="space-y-3">
          <h3 className="font-bold text-zinc-550 text-xs uppercase tracking-wider">Judging Guidelines</h3>

          {filteredGuidelines.length > 0 ? (
            <div className="bg-white border border-zinc-300 rounded-none p-5 shadow-sm space-y-3">
              <ul className="space-y-2">
                {filteredGuidelines.map((g) => (
                  <li
                    key={g.id}
                    className="flex items-start justify-between gap-4 text-xs font-semibold text-zinc-650 bg-zinc-50 p-2.5 rounded-none border border-zinc-200/60 group relative"
                  >
                    <div className="flex gap-2">
                      <Shield className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-normal text-zinc-600">{g.content}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteGuideline(g.id)}
                      className="p-1 rounded-none border border-transparent hover:border-zinc-200 hover:bg-zinc-100 text-zinc-400 hover:text-red-500 cursor-pointer transition-colors shrink-0"
                      title="Remove guideline line"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-white border border-dashed border-zinc-300 rounded-none p-10 text-center text-zinc-400 shadow-sm">
              <Shield className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
              <p className="text-xs font-semibold">No guidelines defined yet for this hackathon</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

/* Sub-component to manage active access codes and expiry count downs */
function JudgeAccessCodeSection({ 
  judgeId, 
  initialCode, 
  initialExpiry 
}: { 
  judgeId: string; 
  initialCode: string | null; 
  initialExpiry: Date | null; 
}) {
  const [code, setCode] = useState<string | null>(initialCode);
  const [expiry, setExpiry] = useState<Date | null>(initialExpiry ? new Date(initialExpiry) : null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  React.useEffect(() => {
    if (!expiry || !code) {
      setTimeLeft("");
      return;
    }

    const updateTimer = () => {
      const diff = expiry.getTime() - Date.now();
      if (diff <= 0) {
        setCode(null);
        setExpiry(null);
        setTimeLeft("");
      } else {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${mins}m ${secs}s left`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [code, expiry]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await generateJudgeAccessCode(judgeId);
      if (res.success && res.code && res.expiresAt) {
        setCode(res.code);
        setExpiry(new Date(res.expiresAt));
      } else {
        alert(res.error || "Failed to generate access code.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isExpired = expiry ? expiry.getTime() <= Date.now() : true;

  return (
    <div className="mt-3 pt-3 border-t border-zinc-150 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-extrabold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
          <Key className="w-3.5 h-3.5 text-zinc-400" />
          Jury Login Access
        </span>
        {code && !isExpired && timeLeft && (
          <span className="text-[9px] text-[#E61E32] font-extrabold bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-none uppercase tracking-wide">
            {timeLeft}
          </span>
        )}
      </div>

      {code && !isExpired ? (
        <div className="flex items-center gap-2">
          {/* Active Code Display */}
          <div className="flex-1 bg-zinc-50 border border-zinc-300 px-3 py-1.5 flex items-center justify-between text-xs font-bold font-mono tracking-widest text-zinc-800">
            <span>{code}</span>
            <button
              onClick={handleCopy}
              className="text-zinc-400 hover:text-zinc-800 cursor-pointer"
              title="Copy code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 animate-in zoom-in" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Open Login Page Link */}
          <a
            href="/judge/login"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#E61E32] hover:bg-[#c91527] text-white font-bold p-2 text-xs flex items-center justify-center gap-1 border border-[#E61E32] transition-colors cursor-pointer shrink-0"
            title="Open Judge Login Page"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Login
          </a>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex-1 py-1.5 px-3 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-zinc-700 font-bold text-[10px] uppercase tracking-wider transition-colors cursor-pointer text-center"
          >
            {isGenerating ? "Generating..." : "Generate 5-Min Code"}
          </button>
          
          <a
            href="/judge/login"
            target="_blank"
            rel="noopener noreferrer"
            className="py-1.5 px-3 border border-zinc-300 hover:bg-zinc-50 text-zinc-650 font-bold text-[10px] uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1 shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
            Portal
          </a>
        </div>
      )}
    </div>
  );
}
