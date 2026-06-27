"use client";

import Link from "next/link";

interface HackathonPublicCardProps {
  hackathon: {
    id: string;
    title: string;
    description: string;
    status: string;
    tag: string;
    bannerUrl: string | null;
  };
}

export default function HackathonPublicCard({ hackathon }: HackathonPublicCardProps) {
  return (
    <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden hover:border-zinc-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[350px] relative">
      <div>
        {/* Top banner header */}
        <div className="w-full aspect-[16/9] bg-zinc-900 flex items-center justify-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              hackathon.bannerUrl ||
              "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1000"
            }
            alt={hackathon.title}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Content Section: Shows only minimal data */}
        <div className="p-5 space-y-3">
          <div>
            <h3 className="text-base font-semibold text-zinc-950 line-clamp-1">
              {hackathon.title}
            </h3>
            <p className="text-xs text-zinc-500 line-clamp-3 font-normal leading-relaxed mt-1">
              {hackathon.description}
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-zinc-100 text-zinc-600 border border-zinc-200 rounded">
              {hackathon.tag}
            </span>
            <span
              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                hackathon.status === "Active"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : hackathon.status === "Draft"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-zinc-100 text-zinc-600 border-zinc-200"
              }`}
            >
              {hackathon.status}
            </span>
          </div>
        </div>
      </div>

      {/* Stacked Action Buttons */}
      <div className="p-5 border-t border-zinc-100 flex flex-col gap-2.5 mt-auto bg-white shrink-0">
        <Link
          href={`/active-hacks/${hackathon.id}`}
          className="w-full text-center border border-zinc-300 hover:bg-zinc-50 hover:border-zinc-400 text-zinc-800 py-2 px-3 rounded text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
        >
          View Details
        </Link>

        <Link
          href={`/team/login?hackathonId=${hackathon.id}`}
          className="w-full text-center bg-[#E61E32] hover:bg-[#c91527] text-white py-2 px-3 rounded text-[11px] font-bold transition-colors shadow-sm cursor-pointer"
        >
          Team Lead Login
        </Link>
      </div>
    </div>
  );
}
