import { getSessionTeam } from "../../../lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import InviteCopyButton from "./InviteCopyButton";
import { headers } from "next/headers";

export default async function TeamInvitePage() {
  const team = await getSessionTeam();

  if (!team) {
    redirect("/team/login");
  }

  // Get active host to build absolute invite URL dynamically
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const inviteUrl = `${protocol}://${host}/team/join?code=${team.joinCode}`;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col justify-between font-sans">
      
      {/* 1. PUBLIC NAVBAR */}
      <header className="w-full bg-[#E61E32] border-b border-[#c91527] px-6 py-4 flex items-center justify-between gap-4 shrink-0 shadow-sm">
        <div className="flex items-baseline gap-2">
          <Link href="/team/dashboard" className="font-semibold text-lg tracking-tight text-white hover:text-zinc-100 transition-colors">
            HackOS
          </Link>
          <span className="text-red-200 text-sm font-normal">/</span>
          <span className="text-red-100 text-sm font-medium">Team Console</span>
        </div>

        <div>
          <Link
            href="/team/dashboard"
            className="bg-white hover:bg-zinc-50 text-[#E61E32] border border-zinc-200 font-bold py-1.5 px-4 rounded text-xs transition-colors shadow-sm cursor-pointer"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      {/* 2. MAIN INVITE CONTENT */}
      <main className="flex-grow flex items-center justify-center p-6 md:p-12 w-full max-w-lg mx-auto">
        <div className="bg-white border border-zinc-200 shadow-sm p-8 rounded-lg space-y-6 w-full text-center">
          
          <div className="w-12 h-12 bg-red-50 text-[#E61E32] rounded-full flex items-center justify-center text-xl font-bold mx-auto shadow-inner border border-red-100">
            ✉️
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-zinc-950">Invite Your Squad</h2>
            <p className="text-xs text-zinc-500 font-normal leading-relaxed">
              Invite your teammates to join <span className="font-semibold text-zinc-800">{team.teamName}</span> for the hackathon.
            </p>
          </div>

          <div className="border-t border-zinc-100 pt-5">
            <InviteCopyButton joinCode={team.joinCode} inviteUrl={inviteUrl} />
          </div>

          <div className="text-[11px] text-zinc-400 font-normal border-t border-zinc-100 pt-5 leading-relaxed text-left">
            <strong>How teammates join:</strong>
            <ol className="list-decimal pl-4 mt-1.5 space-y-1">
              <li>They visit the invite link or click "Join Team with Code" on the login page.</li>
              <li>They enter the code and complete their profile (name, email, password).</li>
              <li>They will be added directly to the team and see this dashboard.</li>
            </ol>
          </div>
        </div>
      </main>

      {/* 3. GREY FOOTER */}
      <footer className="border-t border-zinc-200 py-4 text-center text-xs text-zinc-650 font-semibold bg-zinc-100 w-full shrink-0 flex flex-col sm:flex-row items-center justify-center gap-2">
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
