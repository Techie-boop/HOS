"use server";

import { prisma } from "../../lib/db";
import { revalidatePath } from "next/cache";

export async function updateTeamScoreAction(teamId: string, score: number) {
  try {
    const team = await prisma.team.update({
      where: { id: teamId },
      data: { score },
      select: { hackathonId: true },
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
