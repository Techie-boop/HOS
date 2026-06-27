"use server";

import { prisma } from "../../lib/db";
import { revalidatePath } from "next/cache";

export async function updateProfileAvatar(sessionUserId: string, isLead: boolean, avatarUrl: string) {
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
