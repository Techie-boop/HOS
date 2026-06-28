"use client";

import { useState } from "react";
import { Flame, Terminal, Play, AlertTriangle, ShieldAlert, Sparkles, RefreshCw } from "lucide-react";

interface RoastLog {
  type: "info" | "warning" | "burn" | "success";
  text: string;
}

export default function TeamRoastPage() {
  const [siteUrl, setSiteUrl] = useState("https://hackos-console.vercel.app");
  const [isRoasting, setIsRoasting] = useState(false);
  const [roastDone, setRoastDone] = useState(false);
  const [logs, setLogs] = useState<RoastLog[]>([]);
  const [burnLevel, setBurnLevel] = useState("Mild");

  const roastDatabase = [
    {
      level: "Inferno (Extra Spicy)",
      logs: [
        { type: "info", text: "🔍 Analyzing project assets & bundle size..." },
        { type: "warning", text: "⚠️ Found 4.2MB of uncompressed high-resolution memes in /public directory." },
        { type: "burn", text: "🔥 Your LCP is so slow, users could finish a Next.js certification while waiting for the hero image to load." },
        { type: "info", text: "🔍 Checking database configuration..." },
        { type: "warning", text: "⚠️ Schema check: 12 relation tables detected with ZERO database indexes." },
        { type: "burn", text: "🔥 You have more relationships in schema.prisma than in real life, yet your search queries are running slower than dial-up internet." },
        { type: "info", text: "🔍 Checking color palettes..." },
        { type: "burn", text: "🔥 That #E61E32 red is so bright it violates the Geneva Convention on laser hazards. Dial it down to HSL, please." },
        { type: "success", text: "🎉 Roast completed. Overall Verdict: A beautiful disaster. 4/10." },
      ] as RoastLog[],
    },
    {
      level: "Scorch (Spicy)",
      logs: [
        { type: "info", text: "🔍 Inspecting framework configuration..." },
        { type: "info", text: "💡 Next.js 16.2.9 detected. Welcome to the future." },
        { type: "burn", text: "🔥 You are using Next.js Turbopack but still loading 47 different custom CSS styles like it's 2008." },
        { type: "info", text: "🔍 Auditing page metadata..." },
        { type: "warning", text: "⚠️ Meta description length: 8 characters ('cool site')." },
        { type: "burn", text: "🔥 Search engines will index this page directly into the trash bin. Please read SEO best practices." },
        { type: "success", text: "🎉 Roast completed. Overall Verdict: Code compiles, design cries. 6/10." },
      ] as RoastLog[],
    },
  ];

  const handleStartRoast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteUrl.trim()) return;

    setIsRoasting(true);
    setRoastDone(false);
    setLogs([]);

    // Select a roast random scenario
    const selectedRoast = roastDatabase[Math.floor(Math.random() * roastDatabase.length)];
    setBurnLevel(selectedRoast.level);

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < selectedRoast.logs.length) {
        setLogs((prev) => [...prev, selectedRoast.logs[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setIsRoasting(false);
        setRoastDone(true);
      }
    }, 900);
  };

  const getLogColor = (type: RoastLog["type"]) => {
    switch (type) {
      case "info":
        return "text-zinc-400";
      case "warning":
        return "text-amber-400";
      case "burn":
        return "text-red-400 font-bold";
      case "success":
        return "text-emerald-400 font-bold";
    }
  };

  return (
    <div className="flex-grow p-6 md:p-8 max-w-[1400px] w-full space-y-8 animate-in fade-in duration-200">
      
      {/* Header Info */}
      <section className="bg-white border border-zinc-200 rounded-none p-5 shadow-sm flex flex-col justify-between items-start gap-1">
        <span className="text-[10px] uppercase tracking-widest text-[#E61E32] font-extrabold">Gamified Design Audit</span>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900 mt-1">
          Roast My Site (AI Console)
        </h2>
        <p className="text-xs text-zinc-500 font-normal mt-0.5 leading-relaxed max-w-2xl">
          Submit your live website or project URL for a humorous and critical evaluation of your design, UX choices, and codebase performance.
        </p>
      </section>

      {/* Link Submission */}
      <section className="bg-white border border-zinc-200 p-5 rounded-none shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
          Enter Your Project Credentials
        </h3>
        
        <form onSubmit={handleStartRoast} className="flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            disabled={isRoasting}
            placeholder="https://your-hackathon-project.vercel.app"
            className="flex-1 bg-zinc-50 border border-zinc-200 text-xs px-4 py-2.5 rounded-none font-semibold focus:outline-none focus:border-[#E61E32] focus:bg-white transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={isRoasting}
            className="bg-[#E61E32] hover:bg-[#c91527] disabled:bg-red-400 text-white font-bold text-xs px-6 py-2.5 rounded-none flex items-center justify-center gap-1.5 border border-[#c91527] cursor-pointer shadow-sm transition-all shrink-0"
          >
            {isRoasting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Auditing Codebase...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Roast My Site</span>
              </>
            )}
          </button>
        </form>
      </section>

      {/* Terminal Roast Console */}
      {(isRoasting || logs.length > 0) && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-800 tracking-tight flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#E61E32]" />
              Audit Console Logs
            </h3>
            
            {roastDone && (
              <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-700 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm">
                <Flame className="w-3.5 h-3.5 text-[#E61E32] animate-bounce" />
                <span>Burn Level: {burnLevel}</span>
              </div>
            )}
          </div>

          {/* Terminal Component */}
          <div className="bg-zinc-950 border border-zinc-800 text-zinc-200 font-mono text-[11px] p-5 shadow-2xl rounded-none relative overflow-hidden select-none">
            
            {/* Top dots */}
            <div className="flex gap-1.5 mb-4 shrink-0 pb-3 border-b border-zinc-900">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>

            {/* Logs Area */}
            <div className="space-y-3.5 min-h-[220px] max-h-[400px] overflow-y-auto pr-2 scrollbar-none">
              
              {/* Static starting logs */}
              <div className="text-zinc-500">
                $ hackos-audit --target={siteUrl}
              </div>
              <div className="text-zinc-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Initializing HackOS roasting engine...</span>
              </div>

              {/* Dynamic logs */}
              {logs.map((log, idx) => (
                <div key={idx} className={`leading-relaxed animate-in slide-in-from-bottom-2 fade-in duration-300 ${getLogColor(log.type)}`}>
                  {log.text}
                </div>
              ))}
              
              {/* Input blinking cursor when roasting */}
              {isRoasting && (
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-3.5 bg-zinc-400 animate-ping" />
                </div>
              )}

            </div>

            {/* Corner Decorative elements */}
            <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none select-none">
              <ShieldAlert className="w-48 h-48 text-white" />
            </div>

          </div>
        </section>
      )}

    </div>
  );
}
