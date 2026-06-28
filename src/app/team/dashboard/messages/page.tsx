"use client";

import { useState, useEffect } from "react";
import { Send, Hash, Users, Sparkles, MessageSquare, Loader2 } from "lucide-react";
import { fetchMessagesAction, sendMessageAction, fetchChannelMessageCountsAction, getCurrentUserAction } from "../../../actions/team-feature-actions";

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

const getNameColor = (name: string) => {
  const colors = [
    "text-blue-600",
    "text-purple-650",
    "text-pink-650",
    "text-indigo-600",
    "text-amber-600",
    "text-teal-600",
    "text-emerald-600",
    "text-rose-600"
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

const getBubbleColors = (name: string, isMe: boolean) => {
  if (isMe) {
    return {
      bg: "bg-indigo-50",
      border: "border-indigo-300",
      senderText: "text-indigo-750"
    };
  }
  
  const themes = [
    { bg: "bg-sky-50", border: "border-sky-350", senderText: "text-sky-700" },
    { bg: "bg-purple-50", border: "border-purple-300", senderText: "text-purple-700" },
    { bg: "bg-pink-55", border: "border-pink-300", senderText: "text-pink-700" },
    { bg: "bg-amber-55", border: "border-amber-300", senderText: "text-amber-700" },
    { bg: "bg-teal-55", border: "border-teal-300", senderText: "text-teal-700" },
    { bg: "bg-rose-55", border: "border-rose-300", senderText: "text-rose-700" },
    { bg: "bg-blue-50", border: "border-blue-300", senderText: "text-blue-755" }
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % themes.length;
  return themes[index];
};

const renderSystemMessage = (content: string) => {
  const prefix = "System added ";
  const suffix = " to the console.";
  if (content.startsWith(prefix) && content.endsWith(suffix)) {
    const namePart = content.slice(prefix.length, -suffix.length);
    return (
      <>
        System added <span className="text-[#E61E32] font-black">{namePart}</span> to the console.
      </>
    );
  }
  return content;
};

export default function TeamMessagesPage() {
  const [activeChannel, setActiveChannel] = useState("general");
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [channelCounts, setChannelCounts] = useState<Record<string, number>>({});
  const [currentUser, setCurrentUser] = useState<{ fullName: string; email: string; avatarUrl: string | null } | null>(null);

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

  // Fetch channel message counts
  const loadChannelCounts = async () => {
    try {
      const data = await fetchChannelMessageCountsAction();
      const countMap: Record<string, number> = {};
      data.forEach((c) => {
        countMap[c.channelId] = c.count;
      });
      setChannelCounts(countMap);
    } catch (err) {
      console.error("Error loading message counts:", err);
    }
  };

  // Setup real-time-like sync on mount / channel active change
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const user = await getCurrentUserAction();
        setCurrentUser(user);
        await loadMessages(activeChannel, false);
        await loadChannelCounts();
      } catch (err) {
        console.error("Failed to initialize messages panel:", err);
      } finally {
        setIsLoading(false);
      }
    };
    init();

    // Setup real-time-like polling every 3 seconds
    const interval = setInterval(() => {
      loadMessages(activeChannel, false);
      loadChannelCounts();
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
      setChannelCounts((prev) => ({
        ...prev,
        [activeChannel]: (prev[activeChannel] || 0) + 1,
      }));
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
              
              {/* Message count badge */}
              <span className={`ml-auto w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black border transition-all ${
                activeChannel === chan.id
                  ? "bg-[#E61E32] text-white border-[#E61E32]"
                  : "bg-zinc-100 text-zinc-550 border-zinc-200"
              }`}>
                {channelCounts[chan.id] || 0}
              </span>
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
            messages.map((msg) => {
              const isSystem = msg.senderName === "System";
              const isMe = msg.senderName === currentUser?.fullName || msg.senderName === "You";

              if (isSystem) {
                return (
                  <div key={msg.id} className="flex justify-center w-full my-2 animate-in fade-in duration-200">
                    <span className="bg-zinc-100 border border-zinc-200 text-zinc-555 text-[10px] font-semibold px-3 py-1 rounded-full tracking-wide">
                      {renderSystemMessage(msg.content)}
                    </span>
                  </div>
                );
              }

              const bubbleTheme = getBubbleColors(msg.senderName, isMe);

              if (isMe) {
                return (
                  <div key={msg.id} className="flex justify-end w-full pl-12 animate-in fade-in duration-200">
                    <div className={`${bubbleTheme.bg} border ${bubbleTheme.border} rounded-2xl rounded-tr-none px-3.5 py-2 max-w-[75%] shadow-sm relative`}>
                      <div className="flex items-baseline gap-2 mb-1.5 border-b border-zinc-200/40 pb-0.5">
                        <span className={`text-[10px] font-black uppercase tracking-wider ${bubbleTheme.senderText}`}>
                          {msg.senderName} (You)
                        </span>
                        <span className="text-[8px] bg-zinc-200/50 text-zinc-650 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider scale-95 origin-left">
                          {msg.senderRole}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-800 leading-relaxed font-semibold break-words">
                        {msg.content}
                      </p>
                      <span className="text-[9px] text-zinc-450 block text-right mt-1 font-bold">
                        {msg.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className="flex justify-start w-full pr-12 gap-3 items-start animate-in fade-in duration-200">
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
                  
                  <div className={`${bubbleTheme.bg} border ${bubbleTheme.border} rounded-2xl rounded-tl-none px-3.5 py-2 max-w-[75%] shadow-sm relative`}>
                    <div className="flex items-baseline gap-2 mb-1.5 border-b border-zinc-200/40 pb-0.5">
                      <span className={`text-[10px] font-black uppercase tracking-wider ${bubbleTheme.senderText}`}>
                        {msg.senderName}
                      </span>
                      <span className="text-[8px] bg-zinc-200/50 text-zinc-650 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider scale-95 origin-left">
                        {msg.senderRole}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-700 leading-relaxed font-semibold break-words">
                      {msg.content}
                    </p>
                    <span className="text-[9px] text-zinc-455 block text-right mt-1 font-bold">
                      {msg.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <img
                src="https://cdni.iconscout.com/illustration/premium/thumb/no-messages-illustration-svg-download-png-7973910.png"
                alt="No messages"
                className="w-72 h-72 object-contain mb-4 select-none pointer-events-none"
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
            className="flex-1 bg-zinc-50 hover:bg-zinc-100/60 border border-zinc-200 focus:bg-white focus:outline-none focus:border-[#c91527] text-xs px-4 py-2.5 rounded-none font-semibold transition-all shadow-inner"
          />
          <button
            type="submit"
            className="bg-[#c91527] hover:bg-[#a8101e] border border-[#a8101e] text-white p-2.5 rounded-none flex items-center justify-center shadow-sm transition-all cursor-pointer"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </section>
      
    </div>
  );
}
