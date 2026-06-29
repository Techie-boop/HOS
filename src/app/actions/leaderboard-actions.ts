"use server";

import { prisma } from "../../lib/db";
import { revalidatePath } from "next/cache";
import { getSessionUser, getSessionJudge } from "../../lib/auth";

export async function updateTeamScoreAction(teamId: string, score: number) {
  try {
    const organizer = await getSessionUser();
    const judge = await getSessionJudge();

    if (!organizer && !judge) {
      return { success: false, error: "Unauthorized." };
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { hackathon: true },
    });

    if (!team) {
      return { success: false, error: "Team not found." };
    }

    // If organizer, must own the hackathon
    if (organizer && team.hackathon.organizerId !== organizer.id) {
      return { success: false, error: "Unauthorized." };
    }

    // If judge, must be assigned to the hackathon
    if (judge && team.hackathonId !== judge.hackathonId) {
      return { success: false, error: "Unauthorized." };
    }

    await prisma.team.update({
      where: { id: teamId },
      data: { score },
    });

    revalidatePath("/organizer/dashboard/leaderboard");
    revalidatePath("/team/dashboard/leaderboard");
    revalidatePath(`/leaderboard/${team.hackathonId}`);
    return { success: true };
  } catch (err) {
    console.error("updateTeamScoreAction error:", err);
    return { success: false, error: "Failed to update score" };
  }
}

export async function togglePublishLeaderboardAction(hackathonId: string, publish: boolean) {
  try {
    const organizer = await getSessionUser();
    if (!organizer) {
      return { success: false, error: "Unauthorized." };
    }

    const hackathon = await prisma.hackathon.findUnique({
      where: { id: hackathonId },
    });

    if (!hackathon || hackathon.organizerId !== organizer.id) {
      return { success: false, error: "Unauthorized." };
    }

    await prisma.hackathon.update({
      where: { id: hackathonId },
      data: { publishLeaderboard: publish },
    });

    revalidatePath("/organizer/dashboard/leaderboard");
    revalidatePath("/team/dashboard/leaderboard");
    revalidatePath(`/leaderboard/${hackathonId}`);
    return { success: true };
  } catch (err) {
    console.error("togglePublishLeaderboardAction error:", err);
    return { success: false, error: "Failed to toggle status" };
  }
}
