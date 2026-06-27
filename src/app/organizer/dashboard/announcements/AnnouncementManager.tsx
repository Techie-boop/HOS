"use client";

import React, { useState, useTransition } from "react";
import { createAnnouncement, deleteAnnouncement } from "../../../actions/announcement-actions";
import { Megaphone, Trash2, Calendar, AlertCircle, Loader2 } from "lucide-react";

interface Hackathon {
  id: string;
  title: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  hackathon: {
    title: string;
  };
}

interface AnnouncementManagerProps {
  hackathons: Hackathon[];
  initialAnnouncements: Announcement[];
}

export default function AnnouncementManager({
  hackathons,
  initialAnnouncements,
}: AnnouncementManagerProps) {
  const [selectedHackathonId, setSelectedHackathonId] = useState(hackathons[0]?.id || "");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [isPending, startTransition] = useTransition();

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHackathonId || !title.trim() || !content.trim()) return;

    setMessage(null);

    startTransition(async () => {
      const res = await createAnnouncement(selectedHackathonId, title, content);
      if (res.success) {
        setMessage({ type: "success", text: "Announcement broadcasted successfully to all registered teams!" });
        setTitle("");
        setContent("");
      } else {
        setMessage({ type: "error", text: res.error || "Failed to broadcast announcement." });
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement? Teams will no longer see it.")) return;

    startTransition(async () => {
      const res = await deleteAnnouncement(id);
      if (res.success) {
        setMessage({ type: "success", text: "Announcement deleted successfully." });
      } else {
        setMessage({ type: "error", text: res.error || "Failed to delete announcement." });
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Post Announcement Form */}
      <div className="lg:col-span-1 bg-white border border-zinc-300 rounded-none p-5 shadow-sm space-y-4 h-fit">
        <div className="flex items-center gap-2 border-b border-zinc-200 pb-3">
          <Megaphone className="w-4 h-4 text-[#E61E32]" strokeWidth={2.5} />
          <h3 className="font-bold text-zinc-950 text-xs uppercase tracking-wider">Post an Announcement</h3>
        </div>

        {message && (
          <div
            className={`p-3 rounded-none text-xs font-semibold flex items-start gap-2 border ${
              message.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-current" />
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handlePost} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">Target Hackathon</label>
            {hackathons.length > 0 ? (
              <select
                value={selectedHackathonId}
                onChange={(e) => setSelectedHackathonId(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded-none px-3 py-2 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-zinc-500"
                required
              >
                {hackathons.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.title}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-xs text-amber-600 bg-amber-50 p-2.5 rounded-none border border-amber-200 font-semibold">
                Please create a hackathon first before posting announcements.
              </p>
            )}
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">Announcement Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Opening Ceremony starting in 15 mins!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-zinc-300 rounded-none px-3 py-2 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">Details & Content</label>
            <textarea
              required
              placeholder="Provide context, meeting links, instructions, or files references..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full bg-white border border-zinc-300 rounded-none px-3 py-2 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-zinc-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isPending || hackathons.length === 0}
            className="w-full bg-[#E61E32] hover:bg-[#c91527] disabled:bg-zinc-300 text-white py-2.5 rounded-none text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Broadcasting...
              </>
            ) : (
              <>
                <Megaphone className="w-3.5 h-3.5" /> Broadcast Announcement
              </>
            )}
          </button>
        </form>
      </div>

      {/* Broadcast History */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="font-bold text-zinc-500 text-xs uppercase tracking-wider">Broadcast History</h3>

        {initialAnnouncements.length > 0 ? (
          <div className="space-y-4">
            {initialAnnouncements.map((ann) => (
              <div
                key={ann.id}
                className="bg-white border border-zinc-300 border-l-4 border-l-[#E61E32] rounded-none p-5 shadow-sm space-y-3 relative group transition-all duration-200 hover:border-zinc-400 animate-in fade-in duration-150"
              >
                {/* Delete button top right */}
                <button
                  onClick={() => handleDelete(ann.id)}
                  className="absolute top-4 right-4 p-1.5 rounded-none border border-transparent hover:border-zinc-200 hover:bg-zinc-50 text-zinc-400 hover:text-red-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete announcement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Trophy/Cup icon removed from this badge */}
                    <span className="text-[9px] font-extrabold text-[#E61E32] uppercase tracking-wider bg-red-50 border border-red-200 px-2 py-0.5 rounded-none">
                      {ann.hackathon.title}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-semibold flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-zinc-400" />
                      {new Date(ann.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-zinc-900 leading-snug pt-0.5 pr-8">{ann.title}</h4>
                </div>

                <p className="text-xs text-zinc-600 font-normal whitespace-pre-wrap leading-relaxed pt-0.5">
                  {ann.content}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-zinc-300 rounded-none p-10 text-center text-zinc-400 shadow-sm">
            <Megaphone className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
            <p className="text-xs font-semibold">No announcements broadcasted yet</p>
            <p className="text-[10px] text-zinc-400 mt-1">Use the panel on the left to write and publish your first update.</p>
          </div>
        )}
      </div>

    </div>
  );
}
