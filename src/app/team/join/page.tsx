import JoinTeamForm from "./JoinTeamForm";
import Link from "next/link";
import { Suspense } from "react";

interface PageProps {
  searchParams: Promise<{
    code?: string;
  }>;
}

function JoinPageContent({ code }: { code: string | null }) {
  return <JoinTeamForm initialCode={code} />;
}

export default async function JoinTeamPage({ searchParams }: PageProps) {
  const { code } = await searchParams;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col justify-between font-sans">
      
      {/* 1. PUBLIC NAVBAR (Top Red Bar) */}
      <header className="w-full bg-[#E61E32] border-b border-[#c91527] px-6 py-4 flex items-center justify-between gap-4 shrink-0 shadow-sm">
        <Link href="/" className="font-semibold text-lg tracking-tight text-white hover:text-red-100 transition-colors">
          HackOS
        </Link>
        <div className="flex gap-4 items-center">
          <Link
            href="/active-hacks"
            className="text-xs font-semibold text-red-100 hover:text-white transition-colors"
          >
            Explore Hub
          </Link>
          <Link
            href="/sign-in"
            className="bg-white hover:bg-zinc-50 text-[#E61E32] border border-zinc-200 font-bold py-1.5 px-4 rounded text-xs transition-colors shadow-sm cursor-pointer"
          >
            Organizer Login
          </Link>
        </div>
      </header>

      {/* 2. FORM AREA */}
      <main className="flex-grow flex items-center justify-center p-6 md:p-12 w-full max-w-7xl mx-auto">
        <Suspense fallback={<div className="text-zinc-500 font-medium">Loading...</div>}>
          <JoinPageContent code={code || null} />
        </Suspense>
      </main>

      {/* 3. GREY FOOTER */}
      <footer className="border-t border-zinc-200 py-4 text-center text-xs text-zinc-650 font-semibold bg-zinc-100 w-full shrink-0 flex flex-col sm:flex-row items-center justify-center gap-2">
        <span>© 2026 HackOS Platform. All Rights Reserved.</span>
        <span className="hidden sm:inline text-zinc-300">|</span>
        <div className="flex items-center gap-1.5 font-normal text-zinc-600">
          <span>Powered by</span>
          <img 
            src="https://ik.imagekit.io/dypkhqxip/redlix%20new?updatedAt=1781042212493" 
            alt="Redlix Logo" 
            className="h-6.5 object-contain brightness-95 opacity-90 hover:opacity-100 hover:brightness-100 transition-all"
          />
        </div>
      </footer>

    </div>
  );
}
