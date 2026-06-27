"use server";

import { prisma } from "../../lib/db";
import { getSessionUserId } from "../../lib/auth";
import { revalidatePath } from "next/cache";

export async function createHackathonAction(prevState: any, formData: FormData) {
  const organizerId = await getSessionUserId();
  if (!organizerId) {
    return { success: false, error: "Unauthorized." };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const startDateStr = formData.get("startDate") as string;
  const endDateStr = formData.get("endDate") as string;
  const location = (formData.get("location") as string) || "Online";
  const prizePool = (formData.get("prizePool") as string) || "$0";
  const tag = (formData.get("tag") as string) || "Regional";
  const status = (formData.get("status") as string) || "Draft";
  const bannerUrl = (formData.get("bannerUrl") as string) || null;
  const ticketingLink = (formData.get("ticketingLink") as string) || null;
  const locationLink = (formData.get("locationLink") as string) || null;
  const qrCodeUrl = (formData.get("qrCodeUrl") as string) || null;

  const ticketTiersJson = formData.get("ticketTiers") as string;
  let parsedTicketTiers: Array<{ name: string; priceINR: number }> = [];
  if (ticketTiersJson) {
    try {
      parsedTicketTiers = JSON.parse(ticketTiersJson);
    } catch (e) {
      return { success: false, error: "Invalid ticket tiers format." };
    }
  }

  const prizesJson = formData.get("prizes") as string;
  let parsedPrizes: Array<{ title: string; value: string; description?: string }> = [];
  if (prizesJson) {
    try {
      parsedPrizes = JSON.parse(prizesJson);
    } catch (e) {
      return { success: false, error: "Invalid prizes format." };
    }
  }

  if (!title || !description || !startDateStr || !endDateStr) {
    return { success: false, error: "Missing required fields." };
  }

  try {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return { success: false, error: "Invalid date format." };
    }

    if (startDate > endDate) {
      return { success: false, error: "Start date must be before or equal to end date." };
    }

    // Create the hackathon and its associated prizes
    const hackathon = await prisma.hackathon.create({
      data: {
        title,
        description,
        startDate,
        endDate,
        location,
        prizePool,
        bannerUrl,
        ticketingLink,
        locationLink,
        qrCodeUrl,
        tag,
        status,
        organizerId,
        prizes: {
          create: parsedPrizes.map((p) => ({
            title: p.title,
            value: p.value,
            description: p.description || null,
          })),
        },
        ticketTiers: {
          create: parsedTicketTiers.map((t) => ({
            name: t.name,
            priceINR: Math.max(0, Math.round(Number(t.priceINR) || 0)),
          })),
        },
      },
    });

    // If status is "Active", let's seed 3 mock participant registrations automatically!
    if (status === "Active") {
      const mockParticipants = [
        { fullName: "Alex Rivera", email: `alex.rivera.${Date.now()}@example.com`, phone: "+1 555-0199" },
        { fullName: "Samantha Chen", email: `sam.chen.${Date.now()}@example.com`, phone: "+1 555-0142" },
        { fullName: "Marcus Johnson", email: `marcus.j.${Date.now()}@example.com`, phone: null },
      ];

      for (const mock of mockParticipants) {
        // Find or create participant
        const participant = await prisma.participant.upsert({
          where: { email: mock.email },
          update: {},
          create: {
            fullName: mock.fullName,
            email: mock.email,
            phone: mock.phone,
          },
        });

        // Register participant to hackathon
        await prisma.registration.create({
          data: {
            hackathonId: hackathon.id,
            participantId: participant.id,
          },
        });
      }
    }

  } catch (err: any) {
    console.error("CreateHackathon error:", err);
    return { success: false, error: "Failed to create hackathon. Please try again." };
  }

  revalidatePath("/organizer/dashboard/hackathons");
  revalidatePath("/organizer/dashboard");
  revalidatePath("/organizer/dashboard/participants");
  return { success: true };
}

export async function updateHackathonAction(prevState: any, formData: FormData) {
  const organizerId = await getSessionUserId();
  if (!organizerId) {
    return { success: false, error: "Unauthorized." };
  }

  const hackathonId = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const startDateStr = formData.get("startDate") as string;
  const endDateStr = formData.get("endDate") as string;
  const location = (formData.get("location") as string) || "Online";
  const prizePool = (formData.get("prizePool") as string) || "$0";
  const bannerUrl = (formData.get("bannerUrl") as string) || null;
  const ticketingLink = (formData.get("ticketingLink") as string) || null;
  const locationLink = (formData.get("locationLink") as string) || null;
  const qrCodeUrl = (formData.get("qrCodeUrl") as string) || null;
  const tag = (formData.get("tag") as string) || "Regional";
  const status = (formData.get("status") as string) || "Draft";

  const ticketTiersJson = formData.get("ticketTiers") as string;
  let parsedTicketTiers: Array<{ name: string; priceINR: number }> = [];
  if (ticketTiersJson) {
    try {
      parsedTicketTiers = JSON.parse(ticketTiersJson);
    } catch (e) {
      return { success: false, error: "Invalid ticket tiers format." };
    }
  }

  const prizesJson = formData.get("prizes") as string;
  let parsedPrizes: Array<{ title: string; value: string; description?: string }> = [];
  if (prizesJson) {
    try {
      parsedPrizes = JSON.parse(prizesJson);
    } catch (e) {
      return { success: false, error: "Invalid prizes format." };
    }
  }

  if (!hackathonId || !title || !description || !startDateStr || !endDateStr) {
    return { success: false, error: "Missing required fields." };
  }

  try {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return { success: false, error: "Invalid date format." };
    }

    if (startDate > endDate) {
      return { success: false, error: "Start date must be before or equal to end date." };
    }

    // Verify ownership
    const existing = await prisma.hackathon.findUnique({
      where: { id: hackathonId },
    });

    if (!existing || existing.organizerId !== organizerId) {
      return { success: false, error: "Hackathon not found or unauthorized." };
    }

    // Update in transaction: delete old prizes, update hackathon, create new prizes
    await prisma.$transaction(async (tx) => {
      // Delete existing prizes
      await tx.prize.deleteMany({
        where: { hackathonId },
      });

      // Delete existing ticket tiers
      await tx.ticketTier.deleteMany({
        where: { hackathonId },
      });

      // Update hackathon details & create new prizes & tiers
      await tx.hackathon.update({
        where: { id: hackathonId },
        data: {
          title,
          description,
          startDate,
          endDate,
          location,
          prizePool,
          bannerUrl,
          ticketingLink,
          locationLink,
          qrCodeUrl,
          tag,
          status,
          prizes: {
            create: parsedPrizes.map((p) => ({
              title: p.title,
              value: p.value,
              description: p.description || null,
            })),
          },
          ticketTiers: {
            create: parsedTicketTiers.map((t) => ({
              name: t.name,
              priceINR: Math.max(0, Math.round(Number(t.priceINR) || 0)),
            })),
          },
        },
      });
    });

  } catch (err: any) {
    console.error("UpdateHackathon error:", err);
    return { success: false, error: "Failed to update hackathon. Please try again." };
  }

  revalidatePath("/organizer/dashboard/hackathons");
  revalidatePath("/organizer/dashboard");
  revalidatePath("/organizer/dashboard/participants");
  revalidatePath(`/organizer/dashboard/hackathons/${hackathonId}/edit`);
  return { success: true };
}
