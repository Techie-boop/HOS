import { getSessionUser } from "../../../../lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "../../../../lib/db";
import AnnouncementManager from "./AnnouncementManager";

export default async function OrganizerAnnouncementsPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Fetch organizer's hackathons
  const hackathons = await prisma.hackathon.findMany({
    where: { organizerId: user.id },
    select: { id: true, title: true },
    orderBy: { createdAt: "desc" },
  });

  // Fetch all announcements created by this organizer
  const announcements = await prisma.announcement.findMany({
    where: {
      hackathon: {
        organizerId: user.id,
      },
    },
    include: {
      hackathon: {
        select: { title: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-6 md:p-8 w-full space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">Announcements Manager</h2>
        <p className="text-sm text-zinc-500">Broadcast important updates, deadlines, and news to registered teams</p>
      </div>

      <AnnouncementManager hackathons={hackathons} initialAnnouncements={announcements} />
    </main>
  );
}
