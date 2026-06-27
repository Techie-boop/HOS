import { getSessionUser } from "../../../../lib/auth";
import { prisma } from "../../../../lib/db";
import { redirect } from "next/navigation";
import ParticipantsManager from "./ParticipantsManager";

export default async function ParticipantsPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Fetch registrations for hackathons belonging to this organizer
  const registrations = await prisma.registration.findMany({
    where: {
      hackathon: {
        organizerId: user.id,
      },
    },
    include: {
      hackathon: true,
      participant: true,
    },
    orderBy: {
      registeredAt: "desc",
    },
  });

  return (
    <main className="p-6 md:p-8 w-full space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">Registrations & Participants</h2>
        <p className="text-sm text-zinc-500 mt-1">
          Review, search, and manage all registrations across your hosted hackathons.
        </p>
      </div>

      {/* Participants Manager filter & table */}
      <ParticipantsManager initialRegistrations={registrations} />

    </main>
  );
}
