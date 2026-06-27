"use client";

import { useState, useTransition } from "react";
import { updateProfileAvatar } from "../../../actions/avatar-actions";
import { Loader2, Check } from "lucide-react";

interface Props {
  sessionUserId: string;
  isLead: boolean;
  currentAvatar: string | null;
}

const AVATAR_SEEDS = [
  "Felix",
  "Aneka",
  "Jack",
  "Cody",
  "Sasha",
  "Luna",
  "Milo",
  "Leo",
  "Mia",
  "Zoe",
];

export default function AvatarSelector({ sessionUserId, isLead, currentAvatar }: Props) {
  const [selected, setSelected] = useState<string | null>(currentAvatar);
  const [isPending, startTransition] = useTransition();

  const handleSelect = (seed: string) => {
    const url = `https://api.dicebear.com/7.x/open-peeps/svg?seed=${seed}`;
    setSelected(url);
    startTransition(async () => {
      try {
        await updateProfileAvatar(sessionUserId, isLead, url);
      } catch (err) {
        console.error("Failed to update avatar:", err);
      }
    });
  };

  return (
    <div className="bg-white border border-zinc-300 rounded-none p-5 shadow-sm space-y-4">
      <div className="border-b border-zinc-200 pb-3 flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-500">
          Select Profile Avatar
        </span>
        {isPending && (
          <span className="flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider text-[#E61E32]">
            <Loader2 className="w-3 h-3 animate-spin" /> Saving...
          </span>
        )}
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
        {AVATAR_SEEDS.map((seed) => {
          const url = `https://api.dicebear.com/7.x/open-peeps/svg?seed=${seed}`;
          const isSelected = selected === url;

          return (
            <button
              key={seed}
              type="button"
              disabled={isPending}
              onClick={() => handleSelect(seed)}
              className={`relative border-2 rounded-none p-1 bg-zinc-50 hover:bg-zinc-100 transition-all cursor-pointer ${
                isSelected
                  ? "border-[#E61E32] ring-2 ring-[#E61E32]/10"
                  : "border-zinc-200 hover:border-zinc-300"
              }`}
            >
              <img
                src={url}
                alt={`${seed} Avatar`}
                className="w-full aspect-square object-contain"
              />
              {isSelected && (
                <div className="absolute top-0 right-0 bg-[#E61E32] text-white p-0.5">
                  <Check className="w-2.5 h-2.5" strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
