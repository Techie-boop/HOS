"use client";

import React, { useState, useEffect, useTransition } from "react";
import { updateHackathonDatesAction } from "../../actions/hackathon-actions";
import { Clock, Calendar, Play, ExternalLink, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface Hackathon {
  id: string;
  title: string;
  startDate: Date | string;
  endDate: Date | string;
}

interface DashboardTimerConfigProps {
  hackathons: Hackathon[];
}

export default function DashboardTimerConfig({ hackathons }: DashboardTimerConfigProps) {
  const [selectedId, setSelectedId] = useState(hackathons[0]?.id || "");
  const activeHackathon = hackathons.find((h) => h.id === selectedId) || hackathons[0];

  // Duration preset selection
  const [durationPreset, setDurationPreset] = useState<"12" | "24" | "32" | "48" | "custom">("24");
  const [customHours, setCustomHours] = useState("36");

  // IST Start Date & Time input states
  const [startDateStr, setStartDateStr] = useState("");
  const [startTimeStr, setStartTimeStr] = useState("09:00");

  // Timer state for display
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    status: "NOT_STARTED" | "RUNNING" | "ENDED";
  } | null>(null);

  const [isPending, startTransition] = useTransition();

  // On selected hackathon change, initialize date inputs with its current values in IST (GMT+5:30)
  useEffect(() => {
    if (!activeHackathon) return;

    // Convert existing startDate (UTC or arbitrary timezone) to IST fields for display
    const d = new Date(activeHackathon.startDate);
    
    // Format to YYYY-MM-DD and HH:MM in IST
    // IST is UTC + 5.5 hours
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(d.getTime() + (d.getTimezoneOffset() * 60 * 1000) + istOffset);
    
    const year = istTime.getFullYear();
    const month = String(istTime.getMonth() + 1).padStart(2, "0");
    const date = String(istTime.getDate()).padStart(2, "0");
    const hours = String(istTime.getHours()).padStart(2, "0");
    const minutes = String(istTime.getMinutes()).padStart(2, "0");

    setStartDateStr(`${year}-${month}-${date}`);
    setStartTimeStr(`${hours}:${minutes}`);

    // Compute existing duration in hours
    const startMs = new Date(activeHackathon.startDate).getTime();
    const endMs = new Date(activeHackathon.endDate).getTime();
    const durationHours = Math.round((endMs - startMs) / (60 * 60 * 1000));
    
    if ([12, 24, 32, 48].includes(durationHours)) {
      setDurationPreset(durationHours.toString() as any);
    } else {
      setDurationPreset("custom");
      setCustomHours(durationHours > 0 ? durationHours.toString() : "24");
    }
  }, [selectedId, activeHackathon]);

  // Live countdown timer update loop
  useEffect(() => {
    if (!activeHackathon) return;

    const interval = setInterval(() => {
      const startMs = new Date(activeHackathon.startDate).getTime();
      const endMs = new Date(activeHackathon.endDate).getTime();
      const nowMs = Date.now();

      if (nowMs < startMs) {
        // Not started yet
        const diff = startMs - nowMs;
        setTimeRemaining({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
          status: "NOT_STARTED",
        });
      } else if (nowMs >= startMs && nowMs < endMs) {
        // Running
        const diff = endMs - nowMs;
        setTimeRemaining({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
          status: "RUNNING",
        });
      } else {
        // Ended
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          status: "ENDED",
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeHackathon]);

  const handleSaveTimer = () => {
    if (!startDateStr || !startTimeStr) {
      toast.error("Please fill in both start date and start time.");
      return;
    }

    startTransition(async () => {
      // Build start date in IST timezone (+05:30 offset)
      const startISO = `${startDateStr}T${startTimeStr}:00+05:30`;
      const startD = new Date(startISO);

      if (isNaN(startD.getTime())) {
        toast.error("Invalid start date/time selected.");
        return;
      }

      // Compute end date based on duration
      const hours = durationPreset === "custom" ? parseInt(customHours) || 24 : parseInt(durationPreset);
      const endD = new Date(startD.getTime() + hours * 60 * 60 * 1000);
      const endISO = endD.toISOString();

      const res = await updateHackathonDatesAction(selectedId, startD.toISOString(), endISO);
      
      if (res.success) {
        toast.success("Hackathon timer started and synced successfully!");
      } else {
        toast.error(res.error || "Failed to update timer.");
      }
    });
  };

  if (!activeHackathon) return null;

  const durationHours = durationPreset === "custom" ? parseInt(customHours) || 24 : parseInt(durationPreset);

  return (
    <div className="space-y-6">
      {/* Selector wrapper if there are multiple events */}
      {hackathons.length > 1 && (
        <div className="bg-white border border-zinc-300 p-4 shadow-sm max-w-xl flex items-center justify-between gap-4">
          <label className="text-[10px] font-medium text-zinc-400 block shrink-0">Configuring hackathon</label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="bg-white border border-zinc-300 px-3 py-1.5 text-xs text-zinc-800 focus:outline-none focus:border-zinc-500 font-medium"
          >
            {hackathons.map((h) => (
              <option key={h.id} value={h.id}>
                {h.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Main Configuration Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2 bg-white border border-zinc-300 p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-200 pb-3">
            <Clock className="w-5 h-5 text-[#E61E32]" />
            <div>
              <h3 className="font-semibold text-zinc-950 text-xs">Configure hackathon time & duration</h3>
              <p className="text-[10px] text-zinc-500 mt-0.5">Define duration, start time, and synchronize countdowns</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Duration Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-medium text-zinc-400 block">
                How many hours will your hackathon run? (Working day presets)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { value: "12", label: "12 hours" },
                  { value: "24", label: "24 hours" },
                  { value: "32", label: "32 hours" },
                  { value: "48", label: "48 hours" },
                ].map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setDurationPreset(preset.value as any)}
                    className={`py-2 px-3 text-xs font-medium border transition-all text-center cursor-pointer ${
                      durationPreset === preset.value
                        ? "bg-[#E61E32] text-white border-[#E61E32]"
                        : "bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setDurationPreset("custom")}
                  className={`py-2 px-3 text-xs font-medium border transition-all text-center cursor-pointer ${
                    durationPreset === "custom"
                      ? "bg-[#E61E32] text-white border-[#E61E32]"
                      : "bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  Custom hours
                </button>
              </div>

              {durationPreset === "custom" && (
                <div className="mt-2.5 max-w-xs animate-in slide-in-from-top-1 duration-150">
                  <label className="text-[9px] font-medium text-zinc-400 block mb-1">Specify custom duration (hours)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={customHours}
                      onChange={(e) => setCustomHours(e.target.value)}
                      className="bg-white border border-zinc-300 px-3 py-1.5 text-xs text-zinc-800 font-normal focus:outline-none focus:border-zinc-500 w-24"
                    />
                    <span className="text-xs text-zinc-500 font-normal">hours</span>
                  </div>
                </div>
              )}
            </div>

            {/* Start Date & Time input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-zinc-150 pt-4">
              <div>
                <label className="text-[10px] font-medium text-zinc-400 block mb-1">
                  Start Date (IST)
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={startDateStr}
                    onChange={(e) => setStartDateStr(e.target.value)}
                    className="w-full bg-white border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-800 focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-medium text-zinc-400 block mb-1">
                  Start Time (IST)
                </label>
                <input
                  type="time"
                  value={startTimeStr}
                  onChange={(e) => setStartTimeStr(e.target.value)}
                  className="w-full bg-white border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-800 focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            <div className="text-[10px] text-zinc-500 bg-zinc-50 border border-zinc-200 px-3 py-2 text-justify leading-relaxed flex items-start gap-2 font-normal">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>
                <strong>Timezone Warning:</strong> The system automatically calculates your dates in <strong>Indian Standard Time (IST / GMT+5:30)</strong>. Your hackathon duration is calculated as <strong>{durationHours} hours</strong> from the chosen start time.
              </span>
            </div>

            <button
              onClick={handleSaveTimer}
              disabled={isPending}
              className="w-full bg-[#E61E32] hover:bg-[#c91527] disabled:bg-zinc-300 text-white font-semibold py-2.5 text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isPending ? (
                <>Saving and starting timer...</>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Set & start hackathon timer
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right 1 Col: Live Timer & Public Display Link */}
        <div className="bg-zinc-900 text-white border border-zinc-800 p-6 flex flex-col justify-between space-y-6 shadow-md relative overflow-hidden">
          {/* Subtle grid bg effect */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700 px-2 py-0.5 rounded-none">
                Timer status
              </span>
              {timeRemaining && (
                <span className={`text-[9px] font-semibold px-2 py-0.5 border rounded-none ${
                  timeRemaining.status === "RUNNING"
                    ? "bg-emerald-950/80 text-emerald-400 border-emerald-800/80"
                    : timeRemaining.status === "NOT_STARTED"
                    ? "bg-amber-950/80 text-amber-400 border-amber-800/80"
                    : "bg-zinc-800/80 text-zinc-400 border-zinc-700/80"
                }`}>
                  {timeRemaining.status === "RUNNING"
                    ? "Active"
                    : timeRemaining.status === "NOT_STARTED"
                    ? "Upcoming"
                    : "Ended"}
                </span>
              )}
            </div>

            {/* Countdown grid */}
            <div className="space-y-2 pt-2">
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { label: "days", val: timeRemaining?.days ?? 0 },
                  { label: "hours", val: timeRemaining?.hours ?? 0 },
                  { label: "mins", val: timeRemaining?.minutes ?? 0 },
                  { label: "secs", val: timeRemaining?.seconds ?? 0 },
                ].map((cell, idx) => (
                  <div key={idx} className="bg-zinc-950/60 border border-zinc-800/80 p-2.5 relative">
                    <span className="block text-2xl md:text-3xl font-semibold font-mono tracking-tight text-white">
                      {String(cell.val).padStart(2, "0")}
                    </span>
                    <span className="block text-[8px] text-zinc-550 font-medium mt-1">
                      {cell.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="text-center pt-2">
                <span className="text-[10px] text-zinc-450 font-medium block">
                  {timeRemaining?.status === "RUNNING"
                    ? "Time remaining in hackathon"
                    : timeRemaining?.status === "NOT_STARTED"
                    ? "Countdown to kickoff"
                    : "Hackathon completed"}
                </span>
                <span className="text-[9px] text-zinc-500 block font-normal mt-1">
                  Start: {new Date(activeHackathon.startDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })} IST
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-zinc-800/80 relative z-10">
            <a
              href={`/timer/${activeHackathon.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-zinc-950 border border-zinc-750 hover:bg-zinc-900 text-white font-semibold py-2 px-4 rounded-none text-xs flex items-center justify-center gap-1.5 transition-all shadow-md group cursor-pointer"
            >
              View Public Fullscale Timer
              <ExternalLink className="w-3 h-3 text-zinc-500 group-hover:text-white transition-colors" />
            </a>
            <p className="text-[8px] text-zinc-550 text-center font-normal">
              Open on projectors or public dashboards
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
