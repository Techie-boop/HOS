import { getSessionTeam } from "../../../../lib/auth";
import { redirect } from "next/navigation";

export default async function TeamMentorsPage() {
  const team = await getSessionTeam();
  if (!team) redirect("/team/login");

  return (
    <main className="flex-grow p-6 md:p-8 max-w-[1400px] w-full flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in duration-200">
      <div className="flex flex-col items-center max-w-md w-full">
        <img
          src="https://cdni.iconscout.com/illustration/premium/thumb/unable-loading-illustration-svg-download-png-8257059.png"
          alt="Super admin Module not configured yet"
          className="w-64 h-64 object-contain mb-6 select-none pointer-events-none"
        />
        <div className="w-full bg-red-55 border border-red-200 text-red-700 p-4 rounded-none text-center">
          <p className="text-xs font-black tracking-wide uppercase mb-1">
            Super admin Module not configured yet
          </p>
          <p className="text-[10px] text-red-600 font-semibold leading-relaxed">
            The requested system module has not been deployed on the current active cluster. Please contact support.
          </p>
        </div>
      </div>
    </main>
  );
}
