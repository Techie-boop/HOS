"use server";

import { prisma } from "../../lib/db";
import { revalidatePath } from "next/cache";

export async function submitProject(formData: FormData) {
  const teamId = formData.get("teamId") as string;
  const hackathonId = formData.get("hackathonId") as string;
  const githubUrl = (formData.get("githubUrl") as string).trim();
  const liveUrl = (formData.get("liveUrl") as string | null)?.trim() || null;
  const projectName = (formData.get("projectName") as string | null)?.trim() || null;
  const description = (formData.get("description") as string | null)?.trim() || null;

  if (!githubUrl) throw new Error("GitHub URL is required.");

  await prisma.projectSubmission.upsert({
    where: { teamId },
    update: { githubUrl, liveUrl, projectName, description, updatedAt: new Date() },
    create: { teamId, hackathonId, githubUrl, liveUrl, projectName, description },
  });

  revalidatePath("/team/dashboard/project");
  revalidatePath("/organizer/dashboard/submissions");
}

export async function getSubmissionByTeam(teamId: string) {
  return prisma.projectSubmission.findUnique({ where: { teamId } });
}

export async function getAllSubmissions(hackathonId: string) {
  return prisma.projectSubmission.findMany({
    where: { hackathonId },
    include: { team: { select: { teamName: true, teamLeadName: true, email: true } } },
    orderBy: { submittedAt: "desc" },
  });
}
