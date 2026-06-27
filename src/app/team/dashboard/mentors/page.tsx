import { getSessionTeam } from "../../../../lib/auth";
import { redirect } from "next/navigation";
import { UserCheck } from "lucide-react";

export default async function TeamMentorsPage() {
  const team = await getSessionTeam();
  if (!team) redirect("/team/login");

  return (
    <main className="flex-grow p-6 md:p-8 max-w-[1400px] w-full space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">Ask a Mentor</h2>
        <p className="text-sm text-zinc-500">Request expert support, code reviews, and project feedback</p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg p-12 text-center shadow-sm space-y-4 max-w-xl mx-auto mt-8">
        <UserCheck className="w-10 h-10 text-zinc-300 mx-auto" />
        <h3 className="text-base font-bold text-zinc-800">Mentor Ticket Queue Loading</h3>
        <p className="text-xs text-zinc-400 font-normal leading-relaxed">
          The ticketing system is preparing for kickoff. During the event, you can request technical help from our panels of domain specialists, cloud architects, and fullstack designers.
        </p>
      </div>
    </main>
  );
}
