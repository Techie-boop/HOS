"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface InviteCopyButtonProps {
  joinCode: string;
  inviteUrl: string;
}

export default function InviteCopyButton({ joinCode, inviteUrl }: InviteCopyButtonProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const copyToClipboard = (text: string, type: "code" | "link") => {
    navigator.clipboard.writeText(text);
    if (type === "code") {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="space-y-4 w-full">
      {/* Code Copy Box */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Unique Invite Code</span>
        <div className="flex items-center gap-2">
          <div className="flex-1 font-mono font-bold bg-zinc-50 border border-zinc-200 text-zinc-950 px-4 py-2.5 rounded tracking-widest text-center shadow-inner select-all">
            {joinCode}
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard(joinCode, "code")}
            className="p-3 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-white rounded transition-all cursor-pointer shadow-sm flex items-center justify-center"
            title="Copy Code"
          >
            {copiedCode ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Link Copy Box */}
      <div className="flex flex-col gap-1.5 pt-2">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Direct Invite Link</span>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={inviteUrl}
            className="flex-1 text-xs bg-zinc-50 border border-zinc-200 text-zinc-600 px-3 py-2.5 rounded select-all outline-none font-medium truncate"
          />
          <button
            type="button"
            onClick={() => copyToClipboard(inviteUrl, "link")}
            className="p-3 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-white rounded transition-all cursor-pointer shadow-sm flex items-center justify-center"
            title="Copy Link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
