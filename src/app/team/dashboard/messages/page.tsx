"use client";

import { useState, useEffect } from "react";
import { Send, Hash, Users, Sparkles, MessageSquare, Loader2 } from "lucide-react";
import { fetchMessagesAction, sendMessageAction } from "../../../actions/team-feature-actions";

interface Message {
  id: string;
  senderName: string;
  senderAvatar: string;
  senderRole: string;
  content: string;
  createdAt: Date;
}

interface Channel {
  id: string;
  name: string;
  description: string;
}

export default function TeamMessagesPage() {
  const [activeChannel, setActiveChannel] = useState("general");
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const channels: Channel[] = [
    { id: "general", name: "general-chat", description: "All-purpose chat for teammates to sync up" },
    { id: "announcements", name: "hackathon-announcements", description: "Official broadcasts from Hackathon Organizers" },
    { id: "help", name: "tech-support", description: "Get direct support from mentors and tech crew" },
    { id: "jury", name: "jury-feedback", description: "Direct feedback channel for pitch updates and jury Q&A" },
  ];

  // Fetch messages from backend
  const loadMessages = async (channel: string, showLoader = false) => {
    if (showLoader) setIsLoading(true);
    try {
      const data = await fetchMessagesAction(channel);
      setMessages(
        data.map((msg) => ({
          id: msg.id,
          senderName: msg.senderName,
          senderAvatar: msg.senderAvatar,
          senderRole: msg.senderRole,
          content: msg.content,
          createdAt: new Date(msg.createdAt),
        }))
      );
    } catch (err) {
      console.error("Error loading messages:", err);
    } finally {
      if (showLoader) setIsLoading(false);
    }
  };

  // Reload messages when active channel changes
  useEffect(() => {
    loadMessages(activeChannel, true);

    // Setup real-time-like polling every 3 seconds
    const interval = setInterval(() => {
      loadMessages(activeChannel, false);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeChannel]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const tempText = inputText;
    setInputText("");

    try {
      const newMsg = await sendMessageAction(tempText, activeChannel);
      setMessages((prev) => [
        ...prev,
        {
          id: newMsg.id,
          senderName: newMsg.senderName,
          senderAvatar: newMsg.senderAvatar,
          senderRole: newMsg.senderRole,
          content: newMsg.content,
          createdAt: new Date(newMsg.createdAt),
        },
      ]);
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Failed to send message. Please try again.");
    }
  };

  const currentChannel = channels.find((c) => c.id === activeChannel);

  return (
    <div className="flex-grow flex flex-col md:flex-row h-[calc(100vh-14px-60px-44px)] bg-zinc-50 border-t border-zinc-200">
      
      {/* ── Channel Sidebar ── */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-zinc-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#E61E32]" />
            <h3 className="text-sm font-bold text-zinc-800 tracking-tight">Channels</h3>
          </div>
          <span className="text-[10px] bg-red-50 text-[#E61E32] font-extrabold px-1.5 py-0.5 rounded tracking-wide uppercase animate-pulse">
            Live Database
          </span>
        </div>
        
        <nav className="flex-1 p-2.5 space-y-1 overflow-y-auto">
          {channels.map((chan) => (
            <button
              key={chan.id}
              onClick={() => setActiveChannel(chan.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-none tracking-tight transition-all cursor-pointer ${
                activeChannel === chan.id
                  ? "bg-red-50 text-[#E61E32]"
                  : "text-zinc-600 hover:bg-zinc-150 hover:text-zinc-900"
              }`}
            >
              <Hash className={`w-3.5 h-3.5 shrink-0 ${activeChannel === chan.id ? "text-[#E61E32]" : "text-zinc-400"}`} />
              <span className="truncate">{chan.name}</span>
            </button>
          ))}
        </nav>
        
        {/* Sync Status Info */}
        <div className="p-3 border-t border-zinc-200 bg-zinc-50/50 hidden md:block">
          <div className="flex items-center gap-2 text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>Connection</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-ping" />
            <span>Synced with Neon DB</span>
          </div>
        </div>
      </aside>

      {/* ── Main Chat Area ── */}
      <section className="flex-1 flex flex-col justify-between overflow-hidden bg-white">
        
        {/* Chat Header */}
        <div className="p-4 border-b border-zinc-200 flex flex-col gap-0.5 shrink-0 bg-zinc-50/20">
          <h4 className="text-sm font-bold text-zinc-900 tracking-tight flex items-center gap-1">
            <Hash className="w-4 h-4 text-[#E61E32]" />
            {currentChannel?.name}
          </h4>
          <p className="text-[11px] text-zinc-500 font-normal">
            {currentChannel?.description}
          </p>
        </div>

        {/* Message Logs Pane */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-zinc-50/10">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center">
              <Loader2 className="w-6 h-6 text-[#E61E32] animate-spin" />
              <span className="text-xs text-zinc-400 font-bold mt-2">Connecting to database...</span>
            </div>
          ) : messages.length > 0 ? (
            messages.map((msg) => (
              <div key={msg.id} className="flex gap-3 items-start animate-in fade-in duration-200">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-300 shrink-0 select-none flex items-center justify-center bg-zinc-200">
                  {msg.senderAvatar && (msg.senderAvatar.startsWith("http") || msg.senderAvatar.startsWith("/")) ? (
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-bold text-xs text-zinc-700">
                      {msg.senderAvatar || msg.senderName.split(" ").map(n => n[0]).join("").toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-bold text-zinc-800">{msg.senderName}</span>
                    <span className="text-[9px] bg-zinc-150 text-zinc-650 px-1 py-0 rounded font-bold uppercase tracking-wider scale-90 origin-left">
                      {msg.senderRole}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-normal">
                      {msg.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-650 leading-relaxed break-words pr-4">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <img
                src="https://cdni.iconscout.com/illustration/premium/thumb/no-messages-illustration-svg-download-png-7973910.png"
                alt="No messages"
                className="w-48 h-48 object-contain mb-4 select-none pointer-events-none"
              />
              <h5 className="text-xs font-bold text-zinc-700">No live messages yet</h5>
              <p className="text-[11px] text-zinc-400 font-normal mt-0.5">Be the first to send a message on this database channel!</p>
            </div>
          )}
        </div>

        {/* Message Composition Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-200 bg-white flex gap-3 items-center shrink-0">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message #${currentChannel?.name}...`}
            className="flex-1 bg-zinc-50 hover:bg-zinc-100/60 border border-zinc-200 focus:bg-white focus:outline-none focus:border-[#E61E32] text-xs px-4 py-2.5 rounded-none font-semibold transition-all shadow-inner"
          />
          <button
            type="submit"
            className="bg-[#E61E32] hover:bg-[#c91527] text-white p-2.5 rounded-none flex items-center justify-center shadow-sm transition-all cursor-pointer"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </section>
      
    </div>
  );
}
