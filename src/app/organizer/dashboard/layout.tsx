import { getSessionUser } from "../../../lib/auth";
import { redirect } from "next/navigation";
import ProfileDropdown from "./ProfileDropdown";
import SubNavbar from "./SubNavbar";
import Link from "next/link";
import React from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans">
      
      {/* Fixed Topbar & Sub-Navbar Wrapper */}
      <div className="fixed top-0 left-0 right-0 z-30 flex flex-col shrink-0">
        {/* 1. TOP BAR */}
        <header className="w-full h-[60px] bg-[#E61E32] border-b border-[#c91527] px-6 flex items-center justify-between gap-4 shrink-0 shadow-sm">
          {/* Left Side: Brand & Title aligned correctly */}
          <div className="flex items-baseline gap-2">
            <Link href="/organizer/dashboard" className="font-semibold text-lg tracking-tight text-white hover:text-zinc-100 transition-colors">
              HackOS
            </Link>
            <span className="text-red-200 text-sm font-normal">/</span>
            <span className="text-red-100 text-sm font-medium">Organizer Console</span>
          </div>

          {/* Right Side: Profile Capsule Dropdown */}
          <ProfileDropdown user={{ fullName: user.fullName, email: user.email }} />
        </header>

        {/* 2. HORIZONTAL SUB-NAVBAR */}
        <SubNavbar />
      </div>

      {/* 3. MAIN CONTENT AREA (pt-[106px] offsets the fixed header + navbar height) */}
      <div className="flex-1 overflow-y-auto flex flex-col justify-between pt-[106px]">
        <main className="flex-grow">
          {children}
        </main>

        <footer className="border-t border-zinc-200 py-4 text-center text-xs text-zinc-600 font-semibold bg-white shrink-0 w-full flex flex-col sm:flex-row items-center justify-center gap-2">
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
    </div>
  );
}
