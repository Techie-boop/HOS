"use server";

import { prisma } from "../../lib/db";
import { revalidatePath } from "next/cache";
import { getSessionTeamId } from "../../lib/auth";

export async function updateProfileAvatar(sessionUserId: string, isLead: boolean, avatarUrl: string) {
  const activeSessionId = await getSessionTeamId();
  if (!activeSessionId || activeSessionId !== sessionUserId) {
    throw new Error("Unauthorized");
  }

  if (isLead) {
    await prisma.team.update({
      where: { id: sessionUserId },
      data: { avatarUrl },
    });
  } else {
    await prisma.teamMember.update({
      where: { id: sessionUserId },
      data: { avatarUrl },
    });
  }

  revalidatePath("/team/dashboard/profile");
}
