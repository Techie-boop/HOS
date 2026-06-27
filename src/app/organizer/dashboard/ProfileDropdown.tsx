"use client";

import { useState } from "react";
import { logOutAction } from "../../actions/auth-actions";

interface ProfileDropdownProps {
  user: {
    fullName: string;
    email: string;
  };
}

export default function ProfileDropdown({ user }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await logOutAction();
  };

  return (
    <div className="relative">
      {/* Capsule button with grey solid look */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 rounded-full pl-1.5 pr-4 py-1 text-xs font-semibold shadow-sm focus:outline-none transition-colors duration-150 cursor-pointer"
      >
        {/* White avatar circle */}
        <div className="w-6 h-6 rounded-full bg-white text-zinc-800 border border-zinc-200 flex items-center justify-center font-bold text-[10px] select-none">
          {user.fullName.charAt(0).toUpperCase()}
        </div>
        <span className="max-w-[120px] truncate select-none">{user.fullName}</span>
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 select-none ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Invisible overlay to close dropdown when clicking outside */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          
          <div className="absolute right-0 mt-2 w-48 bg-white border border-zinc-200 rounded-md shadow-lg py-1 z-20 animate-in fade-in slide-in-from-top-1 duration-100">
            <div className="px-4 py-2 border-b border-zinc-100">
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Logged in as</p>
              <p className="text-xs font-bold text-zinc-800 truncate mt-0.5">{user.email}</p>
            </div>
            <a
              href="#"
              className="block px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              My Profile
            </a>
            <button
              onClick={() => {
                setIsOpen(false);
                handleSignOut();
              }}
              className="w-full text-left block px-4 py-2 text-xs font-semibold text-red-600 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
