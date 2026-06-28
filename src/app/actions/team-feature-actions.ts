"use server";

import { prisma } from "../../lib/db";
import { getSessionTeam } from "../../lib/auth";
import { revalidatePath } from "next/cache";

// ── Messages Server Actions ──

export async function fetchMessagesAction(channelId: string) {
  const team = await getSessionTeam();
  if (!team) {
    throw new Error("Unauthorized: Team session not found.");
  }

  return prisma.message.findMany({
    where: {
      hackathonId: team.hackathonId,
      channelId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function sendMessageAction(content: string, channelId: string) {
  const team = await getSessionTeam();
  if (!team) {
    throw new Error("Unauthorized: Team session not found.");
  }

  const message = await prisma.message.create({
    data: {
      content,
      channelId,
      senderName: team.user.fullName,
      senderAvatar: team.user.avatarUrl || team.user.fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase(),
      senderRole: team.isLead ? "Team Lead" : "Team Member",
      teamId: team.id,
      hackathonId: team.hackathonId,
    },
  });

  return message;
}

// ── Jury Consultation Server Actions ──

export async function fetchJudgesAction() {
  const team = await getSessionTeam();
  if (!team) {
    throw new Error("Unauthorized: Team session not found.");
  }

  return prisma.judge.findMany({
    where: {
      hackathonId: team.hackathonId,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function requestJuryConsultationAction(
  judgeId: string,
  type: string,
  notes: string
) {
  const team = await getSessionTeam();
  if (!team) {
    throw new Error("Unauthorized: Team session not found.");
  }

  const request = await prisma.juryRequest.create({
    data: {
      type,
      notes,
      judgeId,
      teamId: team.id,
      status: "Pending",
    },
  });

  return request;
}

export async function fetchJuryRequestsAction() {
  const team = await getSessionTeam();
  if (!team) {
    throw new Error("Unauthorized: Team session not found.");
  }

  return prisma.juryRequest.findMany({
    where: {
      teamId: team.id,
    },
    include: {
      judge: true,
    },
    orderBy: {
      requestedAt: "desc",
    },
  });
}

// ── Ideation Server Actions ──

export async function fetchIdeaAction() {
  const team = await getSessionTeam();
  if (!team) {
    throw new Error("Unauthorized: Team session not found.");
  }

  return prisma.idea.findUnique({
    where: {
      teamId: team.id,
    },
  });
}

export async function saveIdeaAction(
  problem: string,
  solution: string,
  targetAudience: string,
  feasibilityScore: number,
  marketFitScore: number,
  complexity: string
) {
  const team = await getSessionTeam();
  if (!team) {
    throw new Error("Unauthorized: Team session not found.");
  }

  const idea = await prisma.idea.upsert({
    where: {
      teamId: team.id,
    },
    create: {
      problem,
      solution,
      targetAudience,
      feasibilityScore,
      marketFitScore,
      complexity,
      teamId: team.id,
    },
    update: {
      problem,
      solution,
      targetAudience,
      feasibilityScore,
      marketFitScore,
      complexity,
    },
  });

  return idea;
}

// ── Roast My Site Server Actions ──

export async function fetchProjectSubmissionAction() {
  const team = await getSessionTeam();
  if (!team) {
    throw new Error("Unauthorized: Team session not found.");
  }

  return prisma.projectSubmission.findUnique({
    where: {
      teamId: team.id,
    },
  });
}

export async function saveRoastAction(
  liveUrl: string,
  burnLevel: string,
  logsJson: string,
  verdict: string
) {
  const team = await getSessionTeam();
  if (!team) {
    throw new Error("Unauthorized: Team session not found.");
  }

  const roast = await prisma.projectRoast.create({
    data: {
      liveUrl,
      burnLevel,
      logsJson,
      verdict,
      teamId: team.id,
    },
  });

  return roast;
}

export async function fetchRoastsAction() {
  const team = await getSessionTeam();
  if (!team) {
    throw new Error("Unauthorized: Team session not found.");
  }

  return prisma.projectRoast.findMany({
    where: {
      teamId: team.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function fetchChannelMessageCountsAction() {
  const team = await getSessionTeam();
  if (!team) {
    throw new Error("Unauthorized: Team session not found.");
  }

  const counts = await prisma.message.groupBy({
    by: ["channelId"],
    where: {
      hackathonId: team.hackathonId,
    },
    _count: {
      id: true,
    },
  });

  return counts.map((c) => ({
    channelId: c.channelId,
    count: c._count.id,
  }));
}

export async function getCurrentUserAction() {
  const team = await getSessionTeam();
  if (!team) return null;
  return {
    fullName: team.user.fullName,
    email: team.user.email,
    avatarUrl: team.user.avatarUrl,
  };
}
