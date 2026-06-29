import { prisma } from "../../lib/db";
import Link from "next/link";
import HackathonPublicCard from "./HackathonPublicCard";

export const dynamic = "force-dynamic";

export default async function ActiveHacksPage() {
  // Query all non-draft hackathons
  const hackathons = await prisma.hackathon.findMany({
    where: {
      status: {
        in: ["Active", "Completed"],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans">
      
      {/* 1. PUBLIC HEADER */}
      <header className="sticky top-0 z-50 w-full bg-[#E61E32] border-b border-[#c91527] px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 shrink-0 shadow-sm">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <Link href="/" className="font-semibold text-base sm:text-lg tracking-tight text-white hover:text-red-100 transition-colors shrink-0">
            HackOS
          </Link>
          <span className="text-red-200 text-xs sm:text-sm font-normal shrink-0">/</span>
          <span className="text-white text-xs sm:text-sm font-semibold truncate max-w-[150px] sm:max-w-xs">Active Hacks Hub</span>
        </div>

        <div className="shrink-0">
          <Link
            href="/sign-in"
            className="text-zinc-700 hover:text-zinc-900 border border-zinc-300 hover:border-zinc-400 bg-white font-bold py-1.5 px-3 sm:px-4 rounded text-[10px] sm:text-xs transition-colors shadow-sm cursor-pointer whitespace-nowrap"
          >
            <span className="hidden sm:inline">Want to </span>Host a Hack?
          </Link>
        </div>
      </header>

      {/* 2. HERO / HUB TITLE */}
      <section className="bg-zinc-50 border-b border-zinc-200 py-12 px-6 shadow-sm">
        <div className="max-w-6xl w-full mx-auto space-y-3 text-center md:text-left">
          <h1 className="text-3xl font-medium tracking-tight text-zinc-900">
            Active Hackathons Hub
          </h1>
          <p className="text-zinc-500 text-sm max-w-xl leading-relaxed">
            Browse upcoming developer competitions, check out dynamic schedules, view prize breakdown categories, and reserve tickets to compete.
          </p>
        </div>
      </section>

      {/* 3. MAIN HUB LISTING */}
      <main className="p-6 md:p-8 max-w-6xl w-full mx-auto flex-1 space-y-8 animate-in fade-in duration-200">
        
        {hackathons.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-lg p-16 text-center flex flex-col items-center justify-center min-h-[350px] shadow-sm">
            <div className="w-16 h-16 bg-zinc-50 border border-zinc-200 rounded-full flex items-center justify-center text-zinc-500 mb-4 shadow-inner">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v3c0 2.44 1.72 4.48 4 4.88V18H5v2h14v-2h-2v-3.12c2.28-.4 4-2.44 4-4.88V7c0-1.1-.9-2-2-2zm-12 5V7h2v3c0 1.1-.9 2-2 2zm10 0c-1.1 0-2-.9-2-2V7h2v3zm2-3v3c0 1.1-.9 2-2 2h-1V7h3z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-zinc-900 mb-1">
              No Hackathons Scheduled Currently
            </h3>
            <p className="text-zinc-500 text-sm max-w-xs mb-6 font-normal">
              Check back soon for new hackathons, hardware tracks, and regional developer meetups.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {hackathons.map((hackathon) => (
              <HackathonPublicCard key={hackathon.id} hackathon={hackathon} />
            ))}
          </div>
        )}
      </main>

    </div>
  );
}
