import Link from "next/link";
import { Ticket, Calendar, Trophy } from "lucide-react";

export default async function Home() {

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans justify-between">
      
      {/* 1. PUBLIC NAVBAR */}
      <header className="w-full bg-[#E61E32] border-b border-zinc-200 px-6 py-4 flex items-center justify-between gap-4 shrink-0 shadow-sm">
        <Link href="/" className="font-semibold text-lg tracking-tight text-white hover:text-red-100 transition-colors">
          HackOS
        </Link>
        <div className="flex gap-4 items-center">
          <Link
            href="/active-hacks"
            className="text-xs font-semibold text-red-100 hover:text-white transition-colors"
          >
            Explore Hub
          </Link>
          <Link
            href="/sign-in"
            className="bg-white hover:bg-zinc-50 text-[#E61E32] border border-zinc-200 font-bold py-1.5 px-4 rounded-none text-xs transition-colors shadow-sm cursor-pointer"
          >
            Organizer Login
          </Link>
        </div>
      </header>

      {/* 2. MAIN HERO SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-20 max-w-4xl mx-auto text-center space-y-8 animate-in fade-in duration-200">
        
        {/* Decorative Badge */}
        <div className="inline-flex items-center gap-1.5 bg-red-50 text-[#E61E32] border border-red-200 rounded-none px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-inner">
          <span className="w-1.5 h-1.5 bg-[#E61E32] animate-pulse" />
          Next-Generation Hackathon Console
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-zinc-900 max-w-2xl leading-tight">
          Launch, Manage, and Discover <span className="text-[#E61E32] font-semibold">Hackathons</span> Internationally.
        </h1>

        {/* Hero Description */}
        <p className="text-zinc-500 text-sm md:text-base max-w-xl leading-relaxed font-normal">
          HackOS provides organizations with a dynamic workspace console to track developer registrations, set up custom timelines, itemize cash prize rewards, and host event schedules in real-time.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 w-full max-w-xs sm:max-w-md">
          <Link
            href="/active-hacks"
            className="w-full sm:w-auto bg-[#E61E32] hover:bg-[#c91527] text-white font-bold py-3 px-8 rounded-none text-sm transition-all shadow-sm text-center cursor-pointer"
          >
            Explore Active Hacks
          </Link>
          <Link
            href="/sign-in"
            className="w-full sm:w-auto border border-zinc-300 hover:border-zinc-400 bg-white text-zinc-800 font-bold py-3 px-8 rounded-none text-sm transition-all shadow-sm text-center cursor-pointer"
          >
            Organizer Console
          </Link>
        </div>

        {/* Sleek Features Grid Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 w-full text-left">
          <div className="bg-white border border-zinc-300 rounded-none p-5 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-none bg-red-50 text-[#E61E32] flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">Ticketing Integration</h3>
            <p className="text-[11px] text-zinc-500 font-normal leading-relaxed">
              Connect maps and ticketing registration channels directly inside sleek visual cards.
            </p>
          </div>

          <div className="bg-white border border-zinc-300 rounded-none p-5 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-none bg-red-50 text-[#E61E32] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">Event Scheduling</h3>
            <p className="text-[11px] text-zinc-500 font-normal leading-relaxed">
              Formulate real-time timelines and schedule slots dynamically for developers.
            </p>
          </div>

          <div className="bg-white border border-zinc-300 rounded-none p-5 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-none bg-red-50 text-[#E61E32] flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">Prizes Breakdown</h3>
            <p className="text-[11px] text-zinc-500 font-normal leading-relaxed">
              Itemize cash prize rewards and calculate total event pools automatically in the DB.
            </p>
          </div>
        </div>
      </main>
      {/* MVP Status Section */}
      <section className="py-12 w-full shrink-0 bg-zinc-50 border-t border-zinc-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative bg-white border border-zinc-200 p-6 rounded-2xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 overflow-hidden group hover:border-[#E61E32]/20 transition-all duration-300">
            
            {/* Subtle background gradient glow */}
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-[#E61E32]/5 transition-all duration-300" />
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left relative z-10">
              {/* Animated Glowing Dot Container */}
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0 border border-emerald-100 relative">
                <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-sm font-black uppercase tracking-wider text-zinc-950">
                  Live Pilot Testing Running
                </h4>
                <p className="text-xs text-zinc-500 font-normal leading-relaxed max-w-xl">
                  This platform is currently running active developer tests. All database nodes, schedule handlers, and evaluation modules are fully operational.
                </p>
              </div>
            </div>
            
            {/* Quick status badge */}
            <div className="shrink-0 relative z-10">
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full">
                Systems Active
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PUBLIC FOOTER */}
      <footer className="border-t border-zinc-200 py-4 text-center text-xs text-zinc-600 font-semibold bg-white flex flex-col sm:flex-row items-center justify-center gap-2 shrink-0">
        <span>© 2026 HackOS Platform. All Rights Reserved.</span>
        <span className="hidden sm:inline text-zinc-300">|</span>
        <div className="flex items-center gap-1.5 font-normal text-zinc-600">
          <span>Powered by</span>
          <img 
            src="https://ik.imagekit.io/dypkhqxip/redlix%20new?updatedAt=1781042212493" 
            alt="Redlix Logo" 
            className="h-6.5 object-contain brightness-95 opacity-90 hover:opacity-100 hover:brightness-100 transition-all"
          />
        </div>
      </footer>

    </div>
  );
}
