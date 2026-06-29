"use server";

import { prisma } from "../../lib/db";
import { revalidatePath } from "next/cache";
import { getSessionTeam } from "../../lib/auth";

export async function createTaskAction(
  teamId: string,
  title: string,
  description: string,
  assigneeId: string,
  assigneeName: string,
  assigneeRole: string
) {
  const sessionTeam = await getSessionTeam();
  if (!sessionTeam || sessionTeam.id !== teamId) {
    throw new Error("Unauthorized");
  }

  await prisma.task.create({
    data: {
      teamId,
      title,
      description,
      status: "TO_DO",
      assigneeId,
      assigneeName,
      assigneeRole,
    },
  });

  await prisma.taskLog.create({
    data: {
      teamId,
      message: `Created task "${title}" assigned to ${assigneeName} (${assigneeRole})`,
    },
  });

  revalidatePath("/team/dashboard/tasks");
}

export async function moveTaskAction(
  teamId: string,
  taskId: string,
  targetStatus: string,
  completedByName: string | null,
  completedByRole: string | null
) {
  const sessionTeam = await getSessionTeam();
  if (!sessionTeam || sessionTeam.id !== teamId) {
    throw new Error("Unauthorized");
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task || task.teamId !== teamId) return;

  const completedData = {
    completedById: targetStatus === "COMPLETED" ? task.assigneeId : null,
    completedByName: targetStatus === "COMPLETED" ? (completedByName || task.assigneeName) : null,
    completedByRole: targetStatus === "COMPLETED" ? (completedByRole || task.assigneeRole) : null,
    completedAt: targetStatus === "COMPLETED"
      ? new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", second: "numeric" })
      : null,
  };

  await prisma.task.update({
    where: { id: taskId },
    data: {
      status: targetStatus,
      ...completedData,
    },
  });

  const colName =
    targetStatus === "IN_PROGRESS" ? "In Progress" : targetStatus === "COMPLETED" ? "Completed" : "To Do";
  let logMsg = `Moved "${task.title}" to ${colName}`;
  if (targetStatus === "COMPLETED") {
    logMsg += ` (Marked complete by ${completedByName || task.assigneeName} - ${completedByRole || task.assigneeRole})`;
  }

  await prisma.taskLog.create({
    data: {
      teamId,
      message: logMsg,
    },
  });

  revalidatePath("/team/dashboard/tasks");
}

export async function deleteTaskAction(teamId: string, taskId: string, title: string) {
  const sessionTeam = await getSessionTeam();
  if (!sessionTeam || sessionTeam.id !== teamId) {
    throw new Error("Unauthorized");
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task || task.teamId !== teamId) {
    throw new Error("Unauthorized");
  }

  await prisma.task.delete({
    where: { id: taskId },
  });

  await prisma.taskLog.create({
    data: {
      teamId,
      message: `Deleted task "${title}"`,
    },
  });

  revalidatePath("/team/dashboard/tasks");
}
