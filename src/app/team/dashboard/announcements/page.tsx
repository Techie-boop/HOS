import { getSessionTeam } from "../../../../lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "../../../../lib/db";
import { Megaphone, Calendar } from "lucide-react";

export default async function TeamAnnouncementsPage() {
  const team = await getSessionTeam();
  if (!team) redirect("/team/login");

  // Fetch announcements for the team's hackathon
  const announcements = await prisma.announcement.findMany({
    where: { hackathonId: team.hackathonId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="flex-grow p-6 md:p-8 max-w-[1400px] w-full space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">Announcements</h2>
        <p className="text-sm text-zinc-500">Live notifications and broadcast updates from the organizers of {team.hackathon.title}</p>
      </div>

      <div className="space-y-4">
        {/* Organizer Announcements */}
        {announcements.length > 0 ? (
          announcements.map((ann) => (
            <div
              key={ann.id}
              className="bg-zinc-50/50 border border-zinc-200/80 border-l-4 border-l-[#E61E32] rounded-r-lg rounded-l-sm p-5 shadow-sm hover:shadow-md transition-all duration-200 animate-in fade-in slide-in-from-top-1 duration-150"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-100/50 border border-red-200/50 rounded text-[#E61E32] shrink-0">
                  <Megaphone className="w-4 h-4" strokeWidth={2.5} />
                </div>
                <div className="space-y-1 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-[9px] font-extrabold text-[#E61E32] uppercase tracking-wider bg-red-50 border border-red-100/60 px-2 py-0.5 rounded-full w-fit">
                      Organizer Broadcast
                    </span>
                    <span className="text-[10px] text-zinc-400 font-semibold flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-zinc-400" />
                      {new Date(ann.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-zinc-900 leading-snug pt-1">{ann.title}</h4>
                  <p className="text-xs text-zinc-650 font-normal leading-relaxed whitespace-pre-wrap pt-1.5">
                    {ann.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : null}

        {/* Welcome System Broadcast (Static Fallback) */}
        <div className="bg-zinc-50/50 border border-zinc-200/80 border-l-4 border-l-zinc-400 rounded-r-lg rounded-l-sm p-5 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-zinc-150 border border-zinc-200 rounded text-zinc-600 shrink-0">
              <Megaphone className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <div className="space-y-1 w-full">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-extrabold text-zinc-600 uppercase tracking-wider bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-full w-fit">
                  System Broadcaster
                </span>
                <span className="text-[10px] text-zinc-400 font-semibold">WELCOME</span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-zinc-900 leading-snug pt-1">Welcome to HackOS Console</h4>
              <p className="text-xs text-zinc-650 font-normal leading-relaxed pt-1.5">
                Welcome, team! You have successfully set up your workspace console. All event-wide announcements, submission deadline reminders, and mentor slots will be broadcasted here dynamically as the event progresses.
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
