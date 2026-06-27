import { prisma } from "../../../../lib/db";
import { notFound } from "next/navigation";
import RegisterCheckoutForm from "./RegisterCheckoutForm";

interface RegisterPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    tierId?: string;
  }>;
}

export default async function RegisterPage({ params, searchParams }: RegisterPageProps) {
  const { id } = await params;
  const { tierId } = await searchParams;

  const hackathon = await prisma.hackathon.findUnique({
    where: { id },
    include: {
      ticketTiers: true,
    },
  });

  if (!hackathon || hackathon.status !== "Active") {
    notFound();
  }

  return (
    <RegisterCheckoutForm
      hackathonId={hackathon.id}
      hackathonTitle={hackathon.title}
      ticketTiers={hackathon.ticketTiers.map(t => ({
        id: t.id,
        name: t.name,
        priceINR: t.priceINR,
      }))}
      qrCodeUrl={hackathon.qrCodeUrl}
      preselectedTierId={tierId || null}
    />
  );
}
