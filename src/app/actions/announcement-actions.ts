"use server";

import { prisma } from "../../lib/db";
import { getSessionUser } from "../../lib/auth";
import { revalidatePath } from "next/cache";

export async function createAnnouncement(
  hackathonId: string,
  title: string,
  content: string
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      throw new Error("Unauthorized");
    }

    // Verify organizer owns this hackathon
    const hackathon = await prisma.hackathon.findFirst({
      where: {
        id: hackathonId,
        organizerId: user.id,
      },
    });

    if (!hackathon) {
      throw new Error("Hackathon not found or access denied");
    }

    await prisma.announcement.create({
      data: {
        hackathonId,
        title,
        content,
      },
    });

    revalidatePath("/organizer/dashboard/announcements");
    revalidatePath("/team/dashboard/announcements");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteAnnouncement(announcementId: string) {
  try {
    const user = await getSessionUser();
    if (!user) {
      throw new Error("Unauthorized");
    }

    // Verify the organizer owns the hackathon related to this announcement
    const announcement = await prisma.announcement.findUnique({
      where: { id: announcementId },
      include: { hackathon: true },
    });

    if (!announcement || announcement.hackathon.organizerId !== user.id) {
      throw new Error("Access denied");
    }

    await prisma.announcement.delete({
      where: { id: announcementId },
    });

    revalidatePath("/organizer/dashboard/announcements");
    revalidatePath("/team/dashboard/announcements");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
