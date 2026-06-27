"use server";

import { prisma } from "../../lib/db";
import { revalidatePath } from "next/cache";

export async function registerParticipantAction(data: {
  hackathonId: string;
  ticketTierName: string;
  ticketPriceINR: number;
  fullName: string;
  email: string;
  phone?: string;
  transactionId: string;
  paymentMode: string;
}) {
  const {
    hackathonId,
    ticketTierName,
    ticketPriceINR,
    fullName,
    email,
    phone,
    transactionId,
    paymentMode,
  } = data;

  if (!hackathonId || !ticketTierName || ticketPriceINR === undefined || !fullName || !email || !transactionId || !paymentMode) {
    return { success: false, error: "All fields are required." };
  }

  try {
    // 1. Find or create participant
    let participant = await prisma.participant.findUnique({
      where: { email },
    });

    if (!participant) {
      participant = await prisma.participant.create({
        data: {
          fullName,
          email,
          phone: phone || null,
        },
      });
    } else {
      // Update details to ensure latest is captured
      participant = await prisma.participant.update({
        where: { email },
        data: {
          fullName,
          phone: phone || null,
        },
      });
    }

    // 2. Check if already registered
    const existing = await prisma.registration.findUnique({
      where: {
        hackathonId_participantId: {
          hackathonId,
          participantId: participant.id,
        },
      },
    });

    if (existing) {
      return { success: false, error: "You are already registered for this hackathon." };
    }

    // 3. Create registration with status Pending
    await prisma.registration.create({
      data: {
        hackathonId,
        participantId: participant.id,
        ticketTierName,
        ticketPriceINR,
        transactionId,
        paymentMode,
        paymentStatus: "Pending",
      },
    });

    revalidatePath(`/active-hacks/${hackathonId}`);
    revalidatePath("/organizer/dashboard/participants");

    return { success: true };
  } catch (error: any) {
    console.error("registerParticipantAction error:", error);
    return { success: false, error: "Failed to register. Please try again." };
  }
}

export async function updateRegistrationStatusAction(registrationId: string, status: "Verified" | "Rejected") {
  try {
    const updated = await prisma.registration.update({
      where: { id: registrationId },
      data: { paymentStatus: status },
    });

    revalidatePath("/organizer/dashboard/participants");
    revalidatePath(`/active-hacks/${updated.hackathonId}`);

    return { success: true };
  } catch (error: any) {
    console.error("updateRegistrationStatusAction error:", error);
    return { success: false, error: "Failed to update registration status." };
  }
}

