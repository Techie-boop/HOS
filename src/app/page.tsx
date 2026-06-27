import Link from "next/link";
import { prisma } from "../lib/db";

export default async function Home() {
  // Fetch judging guidelines across all hackathons
  const guidelines = await prisma.judgingGuideline.findMany({
    include: {
      hackathon: {
        select: { title: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Group guidelines by hackathon title
  const groupedGuidelines: Record<string, string[]> = {};
  guidelines.forEach((g) => {
    const title = g.hackathon.title;
    if (!groupedGuidelines[title]) {
      groupedGuidelines[title] = [];
    }
    groupedGuidelines[title].push(g.content);
  });

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
            <div className="w-8 h-8 rounded-none bg-red-50 text-[#E61E32] flex items-center justify-center font-bold">
              🎟️
            </div>
            <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">Ticketing Integration</h3>
            <p className="text-[11px] text-zinc-500 font-normal leading-relaxed">
              Connect maps and ticketing registration channels directly inside sleek visual cards.
            </p>
          </div>

          <div className="bg-white border border-zinc-300 rounded-none p-5 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-none bg-red-50 text-[#E61E32] flex items-center justify-center font-bold">
              📅
            </div>
            <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">Event Scheduling</h3>
            <p className="text-[11px] text-zinc-500 font-normal leading-relaxed">
              Formulate real-time timelines and schedule slots dynamically for developers.
            </p>
          </div>

          <div className="bg-white border border-zinc-300 rounded-none p-5 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-none bg-red-50 text-[#E61E32] flex items-center justify-center font-bold">
              💰
            </div>
            <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">Prizes Breakdown</h3>
            <p className="text-[11px] text-zinc-500 font-normal leading-relaxed">
              Itemize cash prize rewards and calculate total event pools automatically in the DB.
            </p>
          </div>
        </div>
      </main>

      {/* 2.5 JUDGING GUIDELINES SECTION */}
      <section className="bg-white border-t border-b border-zinc-200 py-16 w-full shrink-0">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900">Judging Guidelines & Rubrics</h2>
            <p className="text-zinc-500 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
              Explore the core evaluation criteria, scoring rubrics, and guidelines configured by event organizers.
            </p>
          </div>

          {Object.keys(groupedGuidelines).length === 0 ? (
            <div className="bg-zinc-50 border border-zinc-200 rounded-none p-10 text-center text-zinc-400">
              <p className="text-xs font-semibold">No judging guidelines configured yet.</p>
              <p className="text-[10px] text-zinc-400 mt-1">Organizers will define evaluation rubrics when adding panel configuration.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {Object.entries(groupedGuidelines).map(([hackTitle, contents]) => (
                <div key={hackTitle} className="bg-white border border-zinc-300 p-5 rounded-none space-y-3 shadow-sm hover:border-zinc-400 transition-colors">
                  <h3 className="text-xs font-extrabold uppercase text-[#E61E32] tracking-wider border-b border-zinc-150 pb-2">
                    {hackTitle}
                  </h3>
                  <ul className="space-y-2.5">
                    {contents.map((content, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-zinc-600 font-normal leading-relaxed">
                        <span className="text-[#E61E32] font-bold text-xs shrink-0">✓</span>
                        <span>{content}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
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
