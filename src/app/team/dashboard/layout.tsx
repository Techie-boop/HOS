import { getSessionTeam } from "../../../lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import TeamSidebar from "./TeamSidebar";

export default async function TeamDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const team = await getSessionTeam();

  if (!team) {
    redirect("/team/login");
  }

  return (
    /*
     * Full-viewport shell — nothing scrolls at this level.
     * The shell is split into:
     *  • a fixed top bar  (h-14)
     *  • below that: sidebar (fixed, scrollable if needed) + content (scrollable)
     */
    <div className="h-screen flex flex-col overflow-hidden bg-zinc-50 text-zinc-900 font-sans">

      {/* ── 1. FIXED TOP BAR ── */}
      <header className="fixed inset-x-0 top-0 z-40 h-14 bg-[#E61E32] border-b border-[#c91527] px-6 flex items-center justify-between gap-4 shadow-sm shrink-0">
        <div className="flex items-baseline gap-2">
          <Link
            href="/team/dashboard"
            className="font-semibold text-lg tracking-tight text-white hover:text-zinc-100 transition-colors"
          >
            HackOS
          </Link>
          <span className="text-red-200 text-sm font-normal">/</span>
          <span className="text-red-100 text-sm font-medium">Team Console</span>
        </div>

        <div className="flex gap-3 items-center">
          <Link
            href={`/team/invite?joinCode=${team.joinCode}`}
            className="bg-white hover:bg-zinc-50 text-[#E61E32] border border-zinc-200 font-bold py-1.5 px-4 rounded text-xs transition-colors shadow-sm cursor-pointer"
          >
            Invite Your Team
          </Link>
        </div>
      </header>

      {/* ── 2. BELOW TOPBAR: Sidebar + Content ── */}
      {/* pt-14 offsets the fixed header height */}
      <div className="flex flex-1 overflow-hidden pt-14">

        {/* Fixed Sidebar — scrolls internally if nav items overflow */}
        <TeamSidebar />

        {/* Scrollable content pane — ONLY this region scrolls */}
        <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden">
          <main className="flex-1">
            {children}
          </main>

          {/* Footer — sits below content naturally */}
          <footer className="h-[60px] border-t border-zinc-200 text-center text-xs text-zinc-600 font-semibold bg-white shrink-0 w-full flex flex-col sm:flex-row items-center justify-center gap-2">
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

      </div>
    </div>
  );
}
