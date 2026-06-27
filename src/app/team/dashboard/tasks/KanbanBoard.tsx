"use client";

import { useState, useEffect, useTransition } from "react";
import { Plus, User, ArrowLeft, ArrowRight, Activity, Trash2, CheckCircle2, Loader2 } from "lucide-react";
import { createTaskAction, moveTaskAction, deleteTaskAction } from "../../../actions/task-actions";

interface SquadMember {
  id: string;
  name: string;
  role: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  assigneeId: string;
  assigneeName: string;
  assigneeRole: string;
  completedById: string | null;
  completedByName: string | null;
  completedByRole: string | null;
  completedAt: string | null;
}

interface TaskLog {
  id: string;
  message: string;
  createdAt: Date;
}

export default function KanbanBoard({
  squad,
  initialTasks,
  initialLogs,
  teamId,
  currentUserName,
  currentUserRole
}: {
  squad: SquadMember[];
  initialTasks: Task[];
  initialLogs: TaskLog[];
  teamId: string;
  currentUserName: string;
  currentUserRole: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [logs, setLogs] = useState<TaskLog[]>(initialLogs);

  // Sync props from server component revalidation
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  useEffect(() => {
    setLogs(initialLogs);
  }, [initialLogs]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [selectedAssigneeId, setSelectedAssigneeId] = useState(squad[0]?.id || "lead");

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const assignee = squad.find((s) => s.id === selectedAssigneeId) || squad[0];

    startTransition(async () => {
      await createTaskAction(
        teamId,
        newTitle,
        newDesc,
        assignee.id,
        assignee.name,
        assignee.role
      );
      setNewTitle("");
      setNewDesc("");
      setIsFormOpen(false);
    });
  };

  const handleMoveTask = (taskId: string, targetStatus: string) => {
    startTransition(async () => {
      await moveTaskAction(
        teamId,
        taskId,
        targetStatus,
        currentUserName,
        currentUserRole
      );
    });
  };

  const handleDeleteTask = (taskId: string, title: string) => {
    startTransition(async () => {
      await deleteTaskAction(teamId, taskId, title);
    });
  };

  return (
    <div className={`space-y-6 transition-opacity duration-200 ${isPending ? "opacity-75 pointer-events-none" : ""}`}>
      
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="bg-[#E61E32] hover:bg-[#c91527] text-white px-4 py-2 rounded text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} /> Create Task
          </button>
          {isPending && (
            <span className="flex items-center gap-1 text-xs text-zinc-400 font-semibold animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Syncing database...
            </span>
          )}
        </div>

        {/* Real-time database updates are live */}
      </div>

      {/* Task Creation Form */}
      {isFormOpen && (
        <form onSubmit={handleCreateTask} className="bg-zinc-50 border border-zinc-100 rounded-lg p-5 max-w-lg space-y-4 shadow-inner">
          <h4 className="text-xs font-extrabold uppercase text-zinc-600 tracking-wider">New Hackathon Task</h4>
          
          <div className="space-y-3">
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">Task Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Code auth forms"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-white border border-zinc-200 rounded px-3 py-1.5 text-xs text-zinc-800 focus:outline-none focus:border-red-400"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">Task Description</label>
              <textarea
                placeholder="Describe details, acceptance criteria, or repos."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                rows={2}
                className="w-full bg-white border border-zinc-200 rounded px-3 py-1.5 text-xs text-zinc-800 focus:outline-none focus:border-red-400 resize-none"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">Assignee</label>
              <select
                value={selectedAssigneeId}
                onChange={(e) => setSelectedAssigneeId(e.target.value)}
                className="w-full bg-white border border-zinc-200 rounded px-3 py-1.5 text-xs text-zinc-800 focus:outline-none focus:border-red-400"
              >
                {squad.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} ({member.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 justify-end text-xs">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="bg-white hover:bg-zinc-100 text-zinc-650 border border-zinc-200 px-3 py-1.5 rounded font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-zinc-950 hover:bg-zinc-900 text-white px-3 py-1.5 rounded font-bold cursor-pointer border border-zinc-800"
            >
              Create
            </button>
          </div>
        </form>
      )}

      {/* Grid containing Columns + Live Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* TO DO COLUMN (High Visibility Grey) */}
        <div className="bg-zinc-100/95 border border-zinc-300 rounded-lg p-4 flex flex-col gap-4 h-fit shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-200/50 pb-2">
            <span className="text-xs font-extrabold uppercase text-zinc-500 tracking-wider">To Do</span>
            <span className="bg-zinc-200 text-zinc-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {tasks.filter((t) => t.status === "TO_DO").length}
            </span>
          </div>

          <div className="space-y-3">
            {tasks.filter((t) => t.status === "TO_DO").length > 0 ? (
              tasks
                .filter((t) => t.status === "TO_DO")
                .map((task) => (
                  <div key={task.id} className="bg-zinc-900 rounded-lg p-3.5 shadow-md space-y-3 transition-all duration-200 hover:bg-zinc-800/90">
                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-white leading-snug">{task.title}</h5>
                      {task.description && (
                        <p className="text-[10px] text-zinc-400 font-normal leading-relaxed">{task.description}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between border-t border-zinc-800 pt-2.5">
                      <span className="text-[9px] font-bold text-red-450 uppercase bg-red-950/40 border border-red-900/50 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <User className="w-2.5 h-2.5" /> {task.assigneeName}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDeleteTask(task.id, task.title)}
                          className="p-1 hover:bg-zinc-850 rounded text-zinc-450 hover:text-red-400 cursor-pointer transition-colors"
                          title="Delete task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveTask(task.id, "IN_PROGRESS")}
                          className="p-1 hover:bg-zinc-800 rounded text-zinc-300 cursor-pointer border border-zinc-700 transition-colors"
                          title="Move to In Progress"
                        >
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <span className="text-[11px] text-zinc-400 font-medium text-center block py-4 bg-white/40 border border-dashed border-zinc-150 rounded">
                No tasks to do
              </span>
            )}
          </div>
        </div>

        {/* IN PROGRESS COLUMN (High Visibility Amber) */}
        <div className="bg-amber-50/90 border border-amber-300 rounded-lg p-4 flex flex-col gap-4 h-fit shadow-sm">
          <div className="flex items-center justify-between border-b border-amber-100/40 pb-2">
            <span className="text-xs font-extrabold uppercase text-amber-700 tracking-wider">In Progress</span>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {tasks.filter((t) => t.status === "IN_PROGRESS").length}
            </span>
          </div>

          <div className="space-y-3">
            {tasks.filter((t) => t.status === "IN_PROGRESS").length > 0 ? (
              tasks
                .filter((t) => t.status === "IN_PROGRESS")
                .map((task) => (
                  <div key={task.id} className="bg-zinc-900 rounded-lg p-3.5 shadow-md space-y-3 transition-all duration-200 hover:bg-zinc-800/90">
                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-white leading-snug">{task.title}</h5>
                      {task.description && (
                        <p className="text-[10px] text-zinc-400 font-normal leading-relaxed">{task.description}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between border-t border-zinc-800 pt-2.5">
                      <span className="text-[9px] font-bold text-amber-400 uppercase bg-amber-950/40 border border-amber-900/50 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <User className="w-2.5 h-2.5" /> {task.assigneeName}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleMoveTask(task.id, "TO_DO")}
                          className="p-1 hover:bg-zinc-800 rounded text-zinc-300 cursor-pointer border border-zinc-700 transition-colors"
                          title="Move to To Do"
                        >
                          <ArrowLeft className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleMoveTask(task.id, "COMPLETED")}
                          className="p-1 hover:bg-zinc-800 rounded text-zinc-300 cursor-pointer border border-zinc-700 transition-colors"
                          title="Move to Completed"
                        >
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <span className="text-[11px] text-zinc-400 font-medium text-center block py-4 bg-white/40 border border-dashed border-amber-100 rounded">
                No tasks in progress
              </span>
            )}
          </div>
        </div>

        {/* COMPLETED COLUMN (High Visibility Emerald) */}
        <div className="bg-emerald-50/95 border border-emerald-300 rounded-lg p-4 flex flex-col gap-4 h-fit shadow-sm">
          <div className="flex items-center justify-between border-b border-emerald-100/40 pb-2">
            <span className="text-xs font-extrabold uppercase text-emerald-700 tracking-wider">Completed</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {tasks.filter((t) => t.status === "COMPLETED").length}
            </span>
          </div>

          <div className="space-y-3">
            {tasks.filter((t) => t.status === "COMPLETED").length > 0 ? (
              tasks
                .filter((t) => t.status === "COMPLETED")
                .map((task) => (
                  <div key={task.id} className="bg-zinc-900 rounded-lg p-3.5 shadow-md space-y-3 transition-all duration-200 hover:bg-zinc-800/90">
                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-white leading-snug line-through decoration-zinc-700">{task.title}</h5>
                      {task.description && (
                        <p className="text-[10px] text-zinc-400 font-normal leading-relaxed">{task.description}</p>
                      )}
                    </div>

                    <div className="border-t border-zinc-800 pt-2.5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-emerald-400 uppercase bg-emerald-950/40 border border-emerald-900/50 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <User className="w-2.5 h-2.5" /> Assigned: {task.assigneeName}
                        </span>
                        <button
                          onClick={() => handleMoveTask(task.id, "IN_PROGRESS")}
                          className="p-1 hover:bg-zinc-800 rounded text-zinc-300 cursor-pointer border border-zinc-700 transition-colors"
                          title="Move to In Progress"
                        >
                          <ArrowLeft className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-[9px] text-emerald-400 font-semibold flex items-start gap-1 leading-normal">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>Completed by {task.completedByName} ({task.completedByRole})</span>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <span className="text-[11px] text-zinc-400 font-medium text-center block py-4 bg-white/40 border border-dashed border-emerald-100 rounded">
                No completed tasks
              </span>
            )}
          </div>
        </div>

        {/* LIVE ACTIVITY LOGGER (High Visibility Sky Blue) */}
        <div className="bg-sky-50 border border-sky-300 rounded-lg p-4 flex flex-col gap-3 h-[420px] shadow-sm">
          <div className="border-b border-sky-100/40 pb-2">
            <span className="text-xs font-extrabold uppercase text-sky-700 tracking-wider">Live Log</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 text-[10px] font-medium font-sans pr-1">
            {logs.length > 0 ? (
              logs.map((log) => (
                <div key={log.id} className="p-2 bg-white border border-sky-100/40 rounded shadow-sm text-zinc-650 flex items-start gap-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1 shrink-0" />
                  <div className="space-y-0.5">
                    <p className="leading-normal">{log.message}</p>
                    <span className="text-[8px] text-zinc-400 uppercase font-semibold">
                      {new Date(log.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <span className="text-[11px] text-zinc-400 font-medium text-center block py-4">
                No logs recorded yet
              </span>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
