"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { updateTeamScoreAction } from "../../actions/leaderboard-actions";
import { 
  GitBranch, 
  Globe, 
  ExternalLink, 
  Clock, 
  UploadCloud, 
  Users, 
  Shield, 
  UserCheck,
  Megaphone,
  Mail,
  User,
  Home,
  Laptop
} from "lucide-react";

interface Member {
  id: string;
  fullName: string;
  email: string;
}

interface Team {
  id: string;
  teamName: string;
  teamLeadName: string;
  email: string;
  score: number;
  members: Member[];
}

interface Submission {
  id: string;
  teamId: string;
  projectName: string | null;
  description: string | null;
  githubUrl: string;
  liveUrl: string | null;
  submittedAt: Date;
  team: {
    teamName: string;
    teamLeadName: string;
    email: string;
  };
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

interface Guideline {
  id: string;
  content: string;
}

interface Judge {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  hackathon: {
    id: string;
    title: string;
  };
}

interface JuryConsoleProps {
  judge: Judge;
  submissions: Submission[];
  teams: Team[];
  announcements: Announcement[];
  guidelines: Guideline[];
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export default function JuryConsole({
  judge,
  submissions,
  teams,
  announcements,
  guidelines,
}: JuryConsoleProps) {
  const [activeTab, setActiveTab] = useState<"home" | "submissions" | "teams" | "messages" | "profile">("home");
  const [localTeams, setLocalTeams] = useState<Team[]>(teams);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [scoreValue, setScoreValue] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    setLocalTeams(teams);
  }, [teams]);

  useEffect(() => {
    if (selectedTeam) {
      const currentTeam = localTeams.find((t) => t.id === selectedTeam.id);
      setScoreValue(currentTeam ? currentTeam.score.toString() : "0");
    }
  }, [selectedTeam, localTeams]);

  const handleSaveScore = async () => {
    if (!selectedTeam) return;
    const parsedScore = parseInt(scoreValue, 10);
    if (isNaN(parsedScore) || parsedScore < 0 || parsedScore > 1000) {
      toast.error("Please enter a valid score between 0 and 1000.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await updateTeamScoreAction(selectedTeam.id, parsedScore);
      if (res.success) {
        toast.success(`Successfully saved marks for ${selectedTeam.teamName}!`);
        setLocalTeams((prev) =>
          prev.map((t) => (t.id === selectedTeam.id ? { ...t, score: parsedScore } : t))
        );
      } else {
        toast.error(res.error || "Failed to update score.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred while saving marks.");
    } finally {
      setIsSaving(false);
    }
  };

  const selectedTeamIndex = selectedTeam ? localTeams.findIndex(t => t.id === selectedTeam.id) + 1 : 0;
  const selectedTeamSubmission = selectedTeam ? submissions.find(s => s.teamId === selectedTeam.id) : undefined;

  const tabs = [
    { id: "home", name: "Home", count: null },
    { id: "submissions", name: "Submissions", count: submissions.length },
    { id: "teams", name: "Teams", count: localTeams.length },
    { id: "messages", name: "Messages", count: announcements.length },
    { id: "profile", name: "Profile", count: null },
  ] as const;

  return (
    <div className="flex flex-col flex-1">
      {/* SubNavbar */}
      <nav className="w-full bg-white border-b border-zinc-200 px-6 flex items-center gap-6 text-sm font-semibold tracking-tight shadow-sm shrink-0 overflow-x-auto whitespace-nowrap scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-1 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 focus:outline-none shrink-0 ${
                isActive
                  ? "border-[#E61E32] text-zinc-900"
                  : "border-transparent text-zinc-500 hover:text-zinc-950"
              }`}
            >
              {tab.id === "home" && <Home className="w-3.5 h-3.5" />}
              <span>{tab.name}</span>
              {tab.count !== null && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-none font-bold ${
                  isActive ? "bg-red-50 text-[#E61E32] border border-red-200" : "bg-zinc-100 text-zinc-500 border border-zinc-200"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Content Area */}
      <div className="p-6 md:p-8 w-full max-w-[1500px] mx-auto flex-grow">
        
        {/* Render Tab Contents */}
        {activeTab === "home" && (
          <div className="space-y-4 animate-in fade-in duration-150 w-full">
            <h3 className="font-extrabold text-zinc-550 text-xs uppercase tracking-wider">HackOS Software Guidelines</h3>
            
            <div className="bg-white border border-zinc-300 rounded-none p-6 shadow-sm space-y-4 w-full">
              <div className="flex items-center gap-2 border-b border-zinc-200 pb-3">
                <Laptop className="w-4 h-4 text-[#E61E32]" />
                <h4 className="font-bold text-zinc-900 text-xs uppercase tracking-wider">Assigned Evaluation Rubrics & Guidelines</h4>
              </div>

              {guidelines.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-xs text-zinc-400 font-semibold">No judging guidelines configured for this event yet.</p>
                </div>
              ) : (
                <ul className="space-y-3 w-full">
                  {guidelines.map((g, idx) => (
                    <li 
                      key={g.id}
                      className="flex items-start gap-3.5 text-xs text-zinc-650 bg-zinc-50 p-4 border border-zinc-200/60 rounded-none w-full"
                    >
                      <span className="font-extrabold text-[#E61E32] text-sm shrink-0 mt-0.5">{idx + 1}.</span>
                      <span className="leading-relaxed font-normal text-zinc-655">{g.content}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {activeTab === "submissions" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-in fade-in duration-150">
            
            {/* Submissions List */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-extrabold text-zinc-550 text-xs uppercase tracking-wider">Project Deliverables</h3>
              
              {submissions.length === 0 ? (
                <div className="bg-white border border-zinc-300 rounded-none p-16 text-center shadow-sm">
                  <UploadCloud className="w-10 h-10 text-zinc-200 mx-auto mb-3" />
                  <p className="text-xs font-bold text-zinc-500">No project submissions yet</p>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Once participating teams submit their code or slides, they will display instantly here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {submissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="bg-white border border-zinc-300 border-l-4 border-l-[#E61E32] rounded-none shadow-sm flex flex-col justify-between overflow-hidden hover:border-zinc-450 transition-all"
                    >
                      <div>
                        {/* Header */}
                        <div className="px-5 py-3 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <Users className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <span className="text-xs font-bold text-zinc-800 truncate">
                              {sub.team.teamName}
                            </span>
                          </div>
                          <span className="shrink-0 text-[8px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-250 px-2 py-0.5 rounded-none">
                            Delivered
                          </span>
                        </div>

                        {/* Body */}
                        <div className="p-5 space-y-4">
                          {sub.projectName && (
                            <div>
                              <p className="text-sm font-bold text-zinc-900">{sub.projectName}</p>
                              {sub.description && (
                                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                                  {sub.description}
                                </p>
                              )}
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-2 border-t border-b border-zinc-100 py-3">
                            <div>
                              <p className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-400">Team Lead</p>
                              <p className="text-xs font-semibold text-zinc-700 mt-0.5">{sub.team.teamLeadName}</p>
                            </div>
                            <div>
                              <p className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-400">Contact</p>
                              <p className="text-xs font-semibold text-zinc-700 mt-0.5 truncate">{sub.team.email}</p>
                            </div>
                          </div>

                          {/* Action Links */}
                          <div className="flex flex-wrap gap-2 pt-1">
                            <a
                              href={sub.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-none px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer"
                            >
                              <GitBranch className="w-3.5 h-3.5" />
                              GitHub Repository
                              <ExternalLink className="w-2.5 h-2.5 text-zinc-400" />
                            </a>
                            {sub.liveUrl && (
                              <a
                                href={sub.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-zinc-105 border border-zinc-300 hover:bg-zinc-200 text-zinc-800 rounded-none px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer"
                              >
                                <Globe className="w-3.5 h-3.5 text-zinc-500" />
                                Live Demo / Deck
                                <ExternalLink className="w-2.5 h-2.5 text-zinc-400" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Footer Timestamps */}
                      <div className="flex flex-wrap items-center gap-4 px-5 py-3 bg-zinc-50 border-t border-zinc-150 text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-zinc-400" />
                          Submitted: {formatDate(sub.submittedAt)}
                        </span>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Rubrics Panel */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-zinc-550 text-xs uppercase tracking-wider">Evaluation Rubric</h3>
              
              <div className="bg-white border border-zinc-300 rounded-none p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-zinc-200 pb-3">
                  <Shield className="w-4 h-4 text-[#E61E32]" />
                  <h4 className="font-bold text-zinc-900 text-xs uppercase tracking-wider">Judging Rubrics</h4>
                </div>

                {guidelines.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-xs text-zinc-450 font-semibold">No guidelines defined for this event.</p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {guidelines.map((g, idx) => (
                      <li 
                        key={g.id}
                        className="flex items-start gap-2.5 text-xs text-zinc-655 bg-zinc-50 p-3 border border-zinc-200/60 rounded-none"
                      >
                        <span className="font-extrabold text-[#E61E32] text-xs shrink-0 mt-0.5">{idx + 1}.</span>
                        <span className="leading-relaxed font-normal text-zinc-600">{g.content}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

          </div>
        )}

        {activeTab === "teams" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-zinc-550 text-xs uppercase tracking-wider">Competing Teams</h3>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Click on any team card to open the evaluation side panel and assign marks.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold text-zinc-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-emerald-550 border border-emerald-300 inline-block bg-emerald-500"></span>
                  <span>Graded ({localTeams.filter((t) => t.score > 0).length})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-zinc-300 border border-zinc-400 inline-block bg-zinc-100"></span>
                  <span>Pending ({localTeams.filter((t) => !t.score || t.score === 0).length})</span>
                </div>
              </div>
            </div>
            
            {localTeams.length === 0 ? (
              <div className="bg-white border border-zinc-300 rounded-none p-16 text-center shadow-sm">
                <Users className="w-10 h-10 text-zinc-200 mx-auto mb-3" />
                <p className="text-xs font-bold text-zinc-500">No teams competing yet</p>
                <p className="text-[11px] text-zinc-400 mt-1">Once teams register, they will be listed here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-4">
                {localTeams.map((team, idx) => {
                  const isGraded = team.score > 0;
                  const isSelected = selectedTeam?.id === team.id;
                  
                  // Pending = Light Red theme, Evaluated = Light Green theme
                  const theme = isGraded
                    ? {
                        bg: "bg-emerald-50 hover:bg-emerald-100/50",
                        border: "border-emerald-200 hover:border-emerald-350",
                        text: "text-emerald-700",
                        teamLabel: "text-emerald-500",
                        teamName: "text-emerald-900",
                        badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
                        dot: (
                          <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                        ),
                      }
                    : {
                        bg: "bg-red-50 hover:bg-red-100/50",
                        border: "border-red-200 hover:border-red-350",
                        text: "text-red-600",
                        teamLabel: "text-red-400",
                        teamName: "text-red-950",
                        badge: "bg-red-100 text-red-800 border-red-300",
                        dot: (
                          <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                          </span>
                        ),
                      };

                  return (
                    <button
                      key={team.id}
                      onClick={() => setSelectedTeam(team)}
                      className={`relative flex flex-col items-center justify-between p-4 border rounded-2xl shadow-xs cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md group text-center w-full max-w-[130px] aspect-square ${theme.bg} ${theme.border} ${
                        isSelected 
                          ? "ring-2 ring-[#E61E32] border-[#E61E32] bg-white shadow-sm" 
                          : "hover:shadow-xs"
                      }`}
                    >
                      {/* Top Right Live Pulse / Status Dot */}
                      {theme.dot}

                      <div className="flex flex-col items-center w-full min-w-0">
                        <span className={`text-[10px] font-extrabold uppercase tracking-widest leading-none ${theme.teamLabel}`}>
                          Team
                        </span>
                        <span className={`text-4xl font-black my-1 transition-transform duration-300 group-hover:scale-105 leading-none ${theme.text}`}>
                          {idx + 1}
                        </span>
                        <span className={`text-xs font-extrabold line-clamp-2 break-words w-full px-0.5 leading-tight ${theme.teamName}`} title={team.teamName}>
                          {team.teamName}
                        </span>
                      </div>
                      
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md shrink-0 border ${theme.badge}`}>
                        {isGraded ? `${team.score} Pts` : "Pending"}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "messages" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="font-extrabold text-zinc-550 text-xs uppercase tracking-wider">Broadcast History</h3>
            
            {announcements.length === 0 ? (
              <div className="bg-white border border-zinc-300 rounded-none p-16 text-center shadow-sm">
                <Megaphone className="w-10 h-10 text-zinc-200 mx-auto mb-3" />
                <p className="text-xs font-bold text-zinc-500">No organizer announcements yet</p>
                <p className="text-[11px] text-zinc-400 mt-1">Broadcasted hackathon announcements will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4 max-w-4xl">
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="bg-white border border-zinc-300 border-l-4 border-l-[#E61E32] rounded-none p-5 shadow-sm space-y-3 hover:border-zinc-400 transition-all duration-150"
                  >
                    <div className="space-y-1">
                      <span className="text-[9px] text-zinc-400 font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-zinc-400" />
                        {new Date(ann.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <h4 className="text-sm font-bold text-zinc-900 leading-snug">{ann.title}</h4>
                    </div>

                    <p className="text-xs text-zinc-650 font-normal whitespace-pre-wrap leading-relaxed">
                      {ann.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="space-y-4 animate-in fade-in duration-150 max-w-2xl">
            <h3 className="font-extrabold text-zinc-550 text-xs uppercase tracking-wider">Jury Profile</h3>
            
            <div className="bg-white border border-zinc-300 rounded-none p-6 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-5 border-b border-zinc-150">
                <div className="w-20 h-20 bg-zinc-200 border border-zinc-350 flex items-center justify-center text-zinc-500 font-extrabold text-2xl shrink-0 uppercase rounded-none overflow-hidden shadow-inner">
                  {judge.imageUrl ? (
                    <img src={judge.imageUrl} alt={judge.name} className="w-full h-full object-cover" />
                  ) : (
                    judge.name.charAt(0)
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-extrabold text-[#E61E32] uppercase bg-red-50 border border-red-200 px-2 py-0.5 rounded-none">
                    Jury Member
                  </span>
                  <h2 className="text-lg font-bold text-zinc-950 pt-1">{judge.name}</h2>
                  <p className="text-xs text-zinc-450 font-semibold flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-zinc-400" /> Assigned Hackathon: {judge.hackathon.title}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] font-extrabold uppercase text-zinc-400 tracking-wider">Biography & Description</h4>
                  <p className="text-xs text-zinc-650 font-normal leading-relaxed mt-1.5 whitespace-pre-wrap">
                    {judge.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-zinc-150 pt-5 text-xs text-zinc-505">
                  <div>
                    <span className="block text-[10px] font-extrabold uppercase text-zinc-400 tracking-wider">Assigned Console ID</span>
                    <span className="block font-mono font-bold mt-1 text-zinc-800 text-[11px] select-all">{judge.id}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-extrabold uppercase text-zinc-400 tracking-wider">Hackathon ID</span>
                    <span className="block font-mono font-bold mt-1 text-zinc-800 text-[11px] select-all">{judge.hackathon.id}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}


      </div>

      {/* Side Panel for Team Evaluation */}
      {selectedTeam && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-40 transition-opacity animate-in fade-in duration-200"
            onClick={() => setSelectedTeam(null)}
          />
          
          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-zinc-200 animate-in slide-in-from-right duration-250">
            {/* Header */}
            <div className="p-6 border-b border-zinc-200 flex items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest bg-red-50 text-[#E61E32] border border-red-200 px-2 py-0.5">
                    Live Evaluation
                  </span>
                  {selectedTeamSubmission && (
                    <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5">
                      Submitted
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-extrabold text-zinc-900 mt-2">
                  Team {selectedTeamIndex}
                </h3>
                <p className="text-xs text-zinc-550 font-bold mt-0.5">
                  {selectedTeam.teamName}
                </p>
              </div>
              <button 
                onClick={() => setSelectedTeam(null)}
                className="text-zinc-400 hover:text-zinc-700 transition-colors p-2 text-2xl font-light cursor-pointer focus:outline-none"
              >
                &times;
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Score Evaluation Section */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                  Assign Evaluation Marks
                </h4>
                
                <div className="bg-zinc-50 border border-zinc-300 p-5 space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-700 block">
                      Score / Points (Max 1000)
                    </label>
                    
                    <div className="flex items-center gap-3">
                      <input 
                        type="number"
                        min="0"
                        max="1000"
                        value={scoreValue}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "" || (/^\d+$/.test(val) && parseInt(val, 10) <= 1000)) {
                            setScoreValue(val);
                          }
                        }}
                        className="bg-white border border-zinc-300 font-extrabold text-lg text-zinc-900 p-2.5 w-32 text-center focus:outline-none focus:border-[#E61E32] focus:ring-1 focus:ring-[#E61E32] tabular-nums"
                        placeholder="0"
                      />
                      <div className="flex-1">
                        {/* Visual Progress Bar */}
                        <div className="w-full bg-zinc-200 h-2 rounded-none overflow-hidden">
                          <div 
                            className="bg-[#E61E32] h-full transition-all duration-300"
                            style={{ width: `${Math.min(100, (parseInt(scoreValue || "0", 10) / 1000) * 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[9px] font-bold text-zinc-450 mt-1">
                          <span>0 pts</span>
                          <span>1000 pts</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preset Quick Actions */}
                  <div className="space-y-2 border-t border-zinc-200 pt-3.5">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-zinc-400 block">
                      Preset Scores / Adjustments
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[100, 300, 500, 700, 900].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setScoreValue(preset.toString())}
                          className="bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-300 font-bold text-[10px] px-2.5 py-1.5 transition-colors cursor-pointer"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 pt-1">
                      {[-50, -10, 10, 50].map((adj) => (
                        <button
                          key={adj}
                          type="button"
                          onClick={() => {
                            const curr = parseInt(scoreValue || "0", 10);
                            const next = Math.max(0, Math.min(1000, curr + adj));
                            setScoreValue(next.toString());
                          }}
                          className={`font-bold text-[10px] px-2.5 py-1.5 border transition-colors cursor-pointer ${
                            adj > 0 
                              ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-250" 
                              : "bg-red-50 hover:bg-red-100 text-red-700 border-red-250"
                          }`}
                        >
                          {adj > 0 ? `+${adj}` : adj}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleSaveScore}
                    disabled={isSaving}
                    className="w-full bg-[#E61E32] hover:bg-[#c91527] disabled:bg-zinc-300 text-white font-extrabold text-xs uppercase tracking-wider py-3 mt-2 shadow-sm transition-colors cursor-pointer text-center"
                  >
                    {isSaving ? "Saving Evaluation..." : "Save Evaluation Marks"}
                  </button>
                </div>
              </div>

              {/* Team Information */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                  Team Members Info
                </h4>
                
                <div className="bg-white border border-zinc-300 p-4 space-y-3 shadow-sm">
                  <div>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-400 block">
                      Team Leader
                    </span>
                    <span className="text-xs font-bold text-zinc-800 block mt-0.5">
                      {selectedTeam.teamLeadName}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-semibold block">
                      {selectedTeam.email}
                    </span>
                  </div>

                  {selectedTeam.members && selectedTeam.members.length > 0 ? (
                    <div className="border-t border-zinc-150 pt-3">
                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-400 block mb-1.5">
                        Team Members ({selectedTeam.members.length})
                      </span>
                      <div className="space-y-2">
                        {selectedTeam.members.map((member) => (
                          <div key={member.id} className="flex justify-between items-center text-xs bg-zinc-50 border border-zinc-200/60 p-2">
                            <span className="font-semibold text-zinc-800">{member.fullName}</span>
                            <span className="text-[10px] text-zinc-500 font-mono">{member.email}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="border-t border-zinc-150 pt-3">
                      <span className="text-[10px] text-zinc-400 font-bold italic">
                        Solo Participant (Lead only)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Project Deliverable Section */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                  Project Deliverable
                </h4>
                
                {selectedTeamSubmission ? (
                  <div className="bg-white border border-zinc-300 border-l-4 border-l-emerald-550 p-4 space-y-4 shadow-sm">
                    <div>
                      <h5 className="text-xs font-extrabold text-zinc-800">
                        {selectedTeamSubmission.projectName || "Project Submitted"}
                      </h5>
                      {selectedTeamSubmission.description && (
                        <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
                          {selectedTeamSubmission.description}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 border-t border-zinc-100 pt-3">
                      <a 
                        href={selectedTeamSubmission.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-[10px] px-3 py-2 transition-colors cursor-pointer"
                      >
                        <GitBranch className="w-3.5 h-3.5" /> GitHub Repo
                      </a>
                      {selectedTeamSubmission.liveUrl && (
                        <a 
                          href={selectedTeamSubmission.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 bg-zinc-105 border border-zinc-300 hover:bg-zinc-200 text-zinc-800 font-bold text-[10px] px-3 py-2 transition-colors cursor-pointer"
                        >
                          <Globe className="w-3.5 h-3.5 text-zinc-500" /> Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-zinc-50 border border-dashed border-zinc-300 p-6 text-center">
                    <p className="text-xs font-extrabold text-zinc-400">
                      No project deliverables submitted yet.
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-1 leading-snug">
                      Ask the team to submit their project code/slides on their dashboard.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
