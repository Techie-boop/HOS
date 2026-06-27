import { getSessionTeam } from "../../../../lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "../../../../lib/db";
import KanbanBoard from "./KanbanBoard";

export default async function TeamTasksPage() {
  const team = await getSessionTeam();
  if (!team) redirect("/team/login");

  // 1. Fetch live tasks and logs from DB
  const tasks = await prisma.task.findMany({
    where: { teamId: team.id },
    orderBy: { createdAt: "asc" },
  });

  const logs = await prisma.taskLog.findMany({
    where: { teamId: team.id },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  // 2. Format squad members list (combining Lead and Teammates)
  const squad = [
    { id: "lead", name: team.teamLeadName, role: "Team Lead" },
    ...(team.members?.map((m) => ({ id: m.id, name: m.fullName, role: "Teammate" })) || []),
  ];

  const currentUserName = team.user.fullName;
  const currentUserRole = team.isLead ? "Team Lead" : "Teammate";

  return (
    <main className="flex-grow p-6 md:p-8 max-w-[1400px] w-full space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">Task Management</h2>
        <p className="text-sm text-zinc-500">Track milestones and assign action items for your team</p>
      </div>

      {/* Database-backed Kanban Board */}
      <KanbanBoard
        squad={squad}
        initialTasks={tasks}
        initialLogs={logs}
        teamId={team.id}
        currentUserName={currentUserName}
        currentUserRole={currentUserRole}
      />
    </main>
  );
}
