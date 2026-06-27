"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  CheckSquare,
  Megaphone,
  FolderOpen,
  UserCheck,
  Award,
  UploadCloud,
  Trophy,
  FileBadge,
  User,
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react";
import { teamLogOutAction } from "../../actions/team-auth-actions";

export default function TeamSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load collapse state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("team-sidebar-collapsed");
    if (saved) {
      setIsCollapsed(saved === "true");
    }
  }, []);

  const toggleCollapse = () => {
    const newVal = !isCollapsed;
    setIsCollapsed(newVal);
    localStorage.setItem("team-sidebar-collapsed", String(newVal));
  };

  const menuItems = [
    { name: "Dashboard", href: "/team/dashboard", icon: LayoutDashboard },
    { name: "My Team", href: "/team/dashboard/team", icon: Users },
    { name: "Schedule", href: "/team/dashboard/schedule", icon: Calendar },
    { name: "Tasks", href: "/team/dashboard/tasks", icon: CheckSquare },
    { name: "Announcements", href: "/team/dashboard/announcements", icon: Megaphone },
    { name: "Resources", href: "/team/dashboard/resources", icon: FolderOpen },
    { name: "Mentors", href: "/team/dashboard/mentors", icon: UserCheck },
    { name: "Judges", href: "/team/dashboard/judges", icon: Award },
    { name: "Project Submission", href: "/team/dashboard/project", icon: UploadCloud },
    { name: "Leaderboard", href: "/team/dashboard/leaderboard", icon: Trophy },
    { name: "Certificates", href: "/team/dashboard/certificates", icon: FileBadge },
    { name: "Profile", href: "/team/dashboard/profile", icon: User },
  ];

  return (
    <aside
      className={`bg-zinc-100 border-r border-zinc-200 h-full flex flex-col justify-between transition-all duration-300 shrink-0 select-none overflow-y-auto ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex flex-col flex-1">
        
        {/* Toggle Button Header */}
        <div className="p-4 border-b border-zinc-200 flex items-center justify-between gap-2">
          {!isCollapsed && (
            <span className="text-xs uppercase tracking-widest text-zinc-400 font-extrabold">
              Console Menu
            </span>
          )}
          <button
            onClick={toggleCollapse}
            className="p-1.5 hover:bg-zinc-200 rounded text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer ml-auto"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
            ) : (
              <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 py-2.5 px-3 rounded text-sm font-semibold tracking-tight transition-all duration-200 ${
                  isActive
                    ? "bg-red-50 text-[#E61E32] shadow-sm"
                    : "text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-950"
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${isActive ? "text-[#E61E32]" : "text-zinc-400"}`}
                  strokeWidth={2.5}
                />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

      </div>

      {/* Sign Out Button at bottom of sidebar */}
      <div className="h-[60px] px-4 border-t border-zinc-200 bg-transparent shrink-0 flex items-center">
        <form action={teamLogOutAction} className="w-full">
          <button
            type="submit"
            className={`w-full flex items-center gap-3 py-2 px-3 transition-colors bg-transparent border border-[#E61E32] text-[#E61E32] hover:bg-red-50/50 font-bold text-xs rounded-none cursor-pointer ${
              isCollapsed ? "justify-center px-0" : ""
            }`}
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 shrink-0 text-[#E61E32]" strokeWidth={2.5} />
            {!isCollapsed && <span className="truncate">Sign Out</span>}
          </button>
        </form>
      </div>
    </aside>
  );
}
