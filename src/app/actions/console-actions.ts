"use server";

import { prisma } from "../../lib/db";
import { getSessionUserId } from "../../lib/auth";
import { revalidatePath } from "next/cache";

export async function saveConsoleDataAction(prevState: any, formData: FormData) {
  const organizerId = await getSessionUserId();
  if (!organizerId) {
    return { success: false, error: "Unauthorized." };
  }

  const hackathonId = formData.get("hackathonId") as string;
  const faqsJson = formData.get("faqs") as string;
  const scheduleJson = formData.get("scheduleItems") as string;

  if (!hackathonId) {
    return { success: false, error: "Missing Hackathon ID." };
  }

  let faqs: Array<{ question: string; answer: string }> = [];
  let scheduleItems: Array<{ time: string; eventName: string }> = [];

  try {
    if (faqsJson) {
      faqs = JSON.parse(faqsJson);
    }
    if (scheduleJson) {
      scheduleItems = JSON.parse(scheduleJson);
    }
  } catch (e) {
    return { success: false, error: "Invalid JSON format for inputs." };
  }

  try {
    // Verify ownership
    const hackathon = await prisma.hackathon.findUnique({
      where: { id: hackathonId },
    });

    if (!hackathon || hackathon.organizerId !== organizerId) {
      return { success: false, error: "Hackathon not found or unauthorized." };
    }

    // Run transaction to replace FAQ and Schedule records
    await prisma.$transaction(async (tx) => {
      // 1. Delete all old FAQs for this event
      await tx.fAQ.deleteMany({
        where: { hackathonId },
      });

      // 2. Insert new FAQs
      if (faqs.length > 0) {
        await tx.fAQ.createMany({
          data: faqs.map((f) => ({
            question: f.question,
            answer: f.answer,
            hackathonId,
          })),
        });
      }

      // 3. Delete all old schedule items
      await tx.scheduleItem.deleteMany({
        where: { hackathonId },
      });

      // 4. Insert new schedule items
      if (scheduleItems.length > 0) {
        await tx.scheduleItem.createMany({
          data: scheduleItems.map((s) => ({
            time: s.time,
            eventName: s.eventName,
            hackathonId,
          })),
        });
      }
    });

  } catch (err: any) {
    console.error("SaveConsoleData error:", err);
    return { success: false, error: "Failed to save data. Please try again." };
  }

  revalidatePath("/organizer/dashboard/hackathons");
  revalidatePath(`/organizer/dashboard/hackathons/${hackathonId}`);
  return { success: true };
}
