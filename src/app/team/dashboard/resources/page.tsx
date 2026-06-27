import { getSessionTeam } from "../../../../lib/auth";
import { redirect } from "next/navigation";
import { FolderOpen } from "lucide-react";

export default async function TeamResourcesPage() {
  const team = await getSessionTeam();
  if (!team) redirect("/team/login");

  return (
    <main className="flex-grow p-6 md:p-8 max-w-[1400px] w-full space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">Developer Resources</h2>
        <p className="text-sm text-zinc-500">APIs, boilerplates, UI kits, and hardware tracks reference docs</p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg p-12 text-center shadow-sm space-y-4 max-w-xl mx-auto mt-8">
        <FolderOpen className="w-10 h-10 text-zinc-300 mx-auto" />
        <h3 className="text-base font-bold text-zinc-800">Resource Repository Loading</h3>
        <p className="text-xs text-zinc-400 font-normal leading-relaxed">
          Our developer repository is being finalized. Soon, you will have access to boilerplate Github repos, design kits, API credentials, and sponsor-specific guidelines for the hackathon tracks.
        </p>
      </div>
    </main>
  );
}
