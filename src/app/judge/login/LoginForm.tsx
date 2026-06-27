"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginJudgeAction } from "../../actions/judging-actions";
import { Key, AlertCircle, Loader2, ArrowRight } from "lucide-react";

export default function JudgeLoginForm() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, ""); // Keep only digits
    if (val.length <= 6) {
      setCode(val);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError("Please enter a valid 6-digit access code.");
      return;
    }

    setError(null);
    startTransition(async () => {
      const res = await loginJudgeAction(code);
      if (res.success) {
        // Force refresh and redirect to panel
        router.refresh();
        router.push("/judge/panel");
      } else {
        setError(res.error || "Authentication failed. Invalid or expired code.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-start gap-2 rounded-none animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-700" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-1">
        <label className="text-[9px] font-extrabold uppercase text-zinc-400 block tracking-wider">Access Code</label>
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-zinc-400">
            <Key className="w-4 h-4" />
          </span>
          <input
            type="text"
            required
            placeholder="e.g. 482910"
            value={code}
            onChange={handleInputChange}
            className="w-full bg-white border border-zinc-300 rounded-none pl-9 pr-4 py-2 text-sm font-bold font-mono tracking-widest text-zinc-800 focus:outline-none focus:border-zinc-500 placeholder:font-sans placeholder:tracking-normal placeholder:font-normal"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending || code.length !== 6}
        className="w-full bg-[#E61E32] hover:bg-[#c91527] disabled:bg-zinc-200 disabled:text-zinc-400 text-white py-2.5 rounded-none text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
      >
        {isPending ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Authenticating...
          </>
        ) : (
          <>
            Enter Jury Panel
            <ArrowRight className="w-3.5 h-3.5" />
          </>
        )}
      </button>
    </form>
  );
}
