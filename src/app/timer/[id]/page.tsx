import { prisma } from "../../../lib/db";
import { notFound } from "next/navigation";
import TimerDisplay from "./TimerDisplay";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PublicTimerPage({ params }: PageProps) {
  const { id } = await params;

  const hackathon = await prisma.hackathon.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      startDate: true,
      endDate: true,
    },
  });

  if (!hackathon) {
    notFound();
  }

  return <TimerDisplay hackathon={hackathon} />;
}
