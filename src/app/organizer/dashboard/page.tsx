import { getSessionUser } from "../../../lib/auth";
import { prisma } from "../../../lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Calendar, Users } from "lucide-react";

export default async function OrganizerDashboardPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Fetch hackathons for this organizer along with their registered teams
  const hackathons = await prisma.hackathon.findMany({
    where: {
      organizerId: user.id,
    },
    include: {
      registrations: true,
      teams: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="p-6 md:p-8 max-w-6xl w-full mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Welcome Header */}
      <section className="bg-white border border-zinc-300 rounded-none p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#E61E32] font-extrabold block">Organizer Dashboard</span>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900 mt-1">
            Welcome back, {user.fullName}
          </h2>
        </div>
        
        <Link
          href="/organizer/dashboard/hackathons/create"
          className="bg-[#E61E32] hover:bg-[#c91527] text-white font-bold py-2 px-4 rounded-none text-xs transition-colors shadow-sm shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Create New Hackathon
        </Link>
      </section>

      {/* Main Dashboard Widget: Events (Full Width) */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-500">
            Hackathon Events Overview
          </h3>
        </div>
        
        {hackathons.length === 0 ? (
          <div className="bg-white border border-zinc-300 rounded-none p-12 shadow-sm flex flex-col items-center justify-center text-center min-h-[300px]">
            <h4 className="text-sm font-bold text-zinc-900 mb-1">
              No Active Hackathons
            </h4>
            <p className="text-zinc-500 text-xs max-w-xs mb-5 font-normal leading-relaxed">
              You haven&apos;t created any hackathons yet. Get started by creating your first event today.
            </p>
            <Link
              href="/organizer/dashboard/hackathons/create"
              className="py-2 px-4 border border-zinc-350 hover:border-zinc-450 rounded-none bg-white text-zinc-800 text-xs font-bold transition-colors shadow-sm cursor-pointer"
            >
              Create First Event
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hackathons.map((hackathon) => {
              const startDate = new Date(hackathon.startDate).toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
              });
              const endDate = new Date(hackathon.endDate).toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
              });
              
              return (
                <div key={hackathon.id} className="bg-white border border-zinc-300 rounded-none overflow-hidden hover:border-zinc-450 shadow-sm transition-all flex flex-col justify-between">
                  
                  {/* Banner image with overlay removed */}
                  <div className="w-full relative bg-zinc-950 border-b border-zinc-200">
                    <img
                      src={hackathon.bannerUrl || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1000"}
                      alt={hackathon.title}
                      className="w-full h-32 md:h-36 object-cover"
                    />
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      
                      {/* Tag placed under the image card */}
                      <div>
                        <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-red-50 text-[#E61E32] border border-red-200 rounded-none tracking-wider inline-block">
                          {hackathon.tag}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-zinc-950 truncate max-w-[70%]">
                          {hackathon.title}
                        </h4>
                        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-none border ${
                          hackathon.status === "Active"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : hackathon.status === "Draft"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-zinc-50 text-zinc-600 border-zinc-200"
                        }`}>
                          {hackathon.status}
                        </span>
                      </div>
                      <p className="text-zinc-500 text-xs line-clamp-2 leading-relaxed font-normal">
                        {hackathon.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-zinc-200 pt-3 text-[10px] text-zinc-450 font-semibold uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" strokeWidth={2.5} />
                        {startDate} - {endDate}
                      </span>
                      <span className="text-zinc-805 font-extrabold flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-zinc-500 shrink-0" strokeWidth={2.5} />
                        {hackathon.teams.length} Registered Teams
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </main>
  );
}
