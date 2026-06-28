"use client";

import { useState } from "react";
import { Send, Hash, Users, Sparkles, MessageSquare } from "lucide-react";

interface Message {
  id: string;
  sender: string;
  avatar: string;
  role: string;
  content: string;
  timestamp: string;
}

interface Channel {
  id: string;
  name: string;
  description: string;
}

export default function TeamMessagesPage() {
  const [activeChannel, setActiveChannel] = useState("general");
  const [inputText, setInputText] = useState("");

  const channels: Channel[] = [
    { id: "general", name: "general-chat", description: "All-purpose chat for teammates to sync up" },
    { id: "announcements", name: "hackathon-announcements", description: "Official broadcasts from Hackathon Organizers" },
    { id: "help", name: "tech-support", description: "Get direct support from mentors and tech crew" },
    { id: "jury", name: "jury-feedback", description: "Direct feedback channel for pitch updates and jury Q&A" },
  ];

  const initialMessages: Record<string, Message[]> = {
    general: [
      {
        id: "1",
        sender: "Rohit Kalapala",
        avatar: "RK",
        role: "Team Lead",
        content: "Hey guys! Just set up our initial repo. We've got Next.js and Prisma connected successfully.",
        timestamp: "10:14 AM",
      },
      {
        id: "2",
        sender: "Meera Nair",
        avatar: "MN",
        role: "Frontend Dev",
        content: "Awesome, Rohit! I'll begin drafting the navigation system and landing page components now.",
        timestamp: "10:21 AM",
      },
      {
        id: "3",
        sender: "Ananya Roy",
        avatar: "AR",
        role: "Backend Dev",
        content: "Great. I am finishing the DB schemas in prisma/schema.prisma. I will push them before lunch so we can build.",
        timestamp: "10:25 AM",
      },
    ],
    announcements: [
      {
        id: "1",
        sender: "Chief Organizer",
        avatar: "CO",
        role: "Staff",
        content: "🚨 Submissions deadline extended by 2 hours! New deadline is 12:00 PM tomorrow. Keep hacking!",
        timestamp: "9:00 AM",
      },
      {
        id: "2",
        sender: "DevRel Team",
        avatar: "DR",
        role: "Staff",
        content: "💡 Reminder: Check out the #resources tab for pre-configured templates and starter kits.",
        timestamp: "Yesterday",
      },
    ],
    help: [
      {
        id: "1",
        sender: "Rohit Kalapala",
        avatar: "RK",
        role: "Team Lead",
        content: "We are getting CORS errors when requesting data from our API route inside the edge server. Any tip?",
        timestamp: "11:40 AM",
      },
      {
        id: "2",
        sender: "Alex (Tech Mentor)",
        avatar: "AM",
        role: "Mentor",
        content: "Edge runtimes handle fetches differently. Make sure your API route is exporting correct header options. See standard Next.js route handler docs.",
        timestamp: "11:45 AM",
      },
    ],
    jury: [
      {
        id: "1",
        sender: "Jury Board",
        avatar: "JB",
        role: "Jury",
        content: "Jury channel initialized. Once you are ready for a live design audit, head to 'Connect with Jury' tab to request a slot.",
        timestamp: "Yesterday",
      },
    ],
  };

  const [messageLogs, setMessageLogs] = useState<Record<string, Message[]>>(initialMessages);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: Message = {
      id: String(Date.now()),
      sender: "You",
      avatar: "ME",
      role: "Participant",
      content: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessageLogs((prev) => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), newMsg],
    }));
    setInputText("");
  };

  const currentMessages = messageLogs[activeChannel] || [];
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
          <span className="text-[10px] bg-red-50 text-[#E61E32] font-extrabold px-1.5 py-0.5 rounded tracking-wide uppercase">
            Teammates
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
        
        {/* Active Members Footer */}
        <div className="p-3 border-t border-zinc-200 bg-zinc-50/50 hidden md:block">
          <div className="flex items-center gap-2 text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Active Sync</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-zinc-700 font-medium">Rohit Kalapala</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-zinc-700 font-medium">Meera Nair</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 shrink-0 animate-pulse" />
              <span className="text-zinc-500">Ananya Roy</span>
            </div>
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
          {currentMessages.length > 0 ? (
            currentMessages.map((msg) => {
              const isMe = msg.sender === "You";
              return (
                <div key={msg.id} className="flex gap-3 items-start animate-in fade-in duration-200">
                  <div className={`w-8 h-8 flex items-center justify-center font-bold text-xs select-none shrink-0 ${
                    isMe 
                      ? "bg-[#E61E32] text-white" 
                      : "bg-zinc-200 text-zinc-700 border border-zinc-350"
                  }`}>
                    {msg.avatar}
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-bold text-zinc-800">{msg.sender}</span>
                      <span className="text-[9px] bg-zinc-150 text-zinc-600 px-1 py-0 rounded font-bold uppercase tracking-wider scale-90 origin-left">
                        {msg.role}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-normal">{msg.timestamp}</span>
                    </div>
                    <p className="text-xs text-zinc-650 leading-relaxed break-words pr-4">
                      {msg.content}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <Sparkles className="w-8 h-8 text-zinc-300 mb-2 animate-pulse" />
              <p className="text-xs text-zinc-500 font-medium">No messages yet. Send a message to start syncing!</p>
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
