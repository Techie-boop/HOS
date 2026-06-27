import { getSessionUser } from "../../../../../lib/auth";
import { redirect } from "next/navigation";
import CreateHackathonPageForm from "./CreateHackathonPageForm";
import Link from "next/link";

export default async function CreateHackathonPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <main className="p-6 md:p-8 max-w-4xl w-full mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
        <Link href="/organizer/dashboard/hackathons" className="hover:text-[#E61E32] transition-colors">
          My Hackathons
        </Link>
        <span>/</span>
        <span className="text-zinc-800">Create</span>
      </div>

      <header className="border-b border-zinc-200 pb-4">
        <h1 className="text-2xl font-medium tracking-tight text-zinc-900">
          Create New Hackathon
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          Provide all details, setup schedule parameters, and itemize your prize distributions.
        </p>
      </header>

      <CreateHackathonPageForm />
    </main>
  );
}
