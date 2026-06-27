import { getSessionTeam } from "../../../../lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "../../../../lib/db";
import { Calendar, Clock } from "lucide-react";

export default async function TeamSchedulePage() {
  const team = await getSessionTeam();
  if (!team) redirect("/team/login");

  const schedule = await prisma.scheduleItem.findMany({
    where: { hackathonId: team.hackathonId },
    orderBy: { time: "asc" }
  });

  return (
    <main className="flex-grow p-6 md:p-8 max-w-[1400px] w-full space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">Event Schedule</h2>
        <p className="text-sm text-zinc-500">Timeline and agenda for {team.teamName} at {team.hackathon.title}</p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm">
        {schedule.length > 0 ? (
          <div className="relative border-l-2 border-red-200 pl-6 ml-3 space-y-8 py-2">
            {schedule.map((item) => (
              <div key={item.id} className="relative">
                <span className="absolute -left-[31px] top-1.5 bg-white border-2 border-[#E61E32] rounded-full w-4 h-4 shadow-sm" />
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#E61E32] uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.time}</span>
                  </div>
                  <h4 className="text-base font-bold text-zinc-900">{item.eventName}</h4>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 space-y-2">
            <Calendar className="w-8 h-8 text-zinc-300 mx-auto" />
            <h4 className="text-sm font-bold text-zinc-700">No Schedule Items Posted</h4>
            <p className="text-xs text-zinc-400 font-normal max-w-xs mx-auto leading-relaxed">
              No schedule items have been posted for this hackathon yet. Check back closer to the launch date!
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
