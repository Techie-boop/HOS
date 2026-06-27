import { getSessionUser } from "../../../../../../lib/auth";
import { prisma } from "../../../../../../lib/db";
import { redirect, notFound } from "next/navigation";
import EditHackathonPageForm from "./EditHackathonPageForm";
import Link from "next/link";

interface EditHackathonPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditHackathonPage({ params }: EditHackathonPageProps) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { id } = await params;

  // Fetch hackathon details and related prizes
  const hackathon = await prisma.hackathon.findUnique({
    where: {
      id,
    },
    include: {
      prizes: true,
      ticketTiers: true,
    },
  });

  // Verify ownership and existence
  if (!hackathon || hackathon.organizerId !== user.id) {
    notFound();
  }

  return (
    <main className="p-6 md:p-8 max-w-4xl w-full mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
        <Link href="/organizer/dashboard/hackathons" className="hover:text-[#E61E32] transition-colors">
          My Hackathons
        </Link>
        <span>/</span>
        <span className="text-zinc-400 font-normal">Edit Event</span>
        <span>/</span>
        <span className="text-zinc-800">{hackathon.title}</span>
      </div>

      <header className="border-b border-zinc-200 pb-4">
        <h1 className="text-2xl font-medium tracking-tight text-zinc-900">
          Edit Hackathon Details
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          Adjust schedule dates, links, custom banner URLs, and specific prize reward distributions.
        </p>
      </header>

      <EditHackathonPageForm hackathon={hackathon} />
    </main>
  );
}
