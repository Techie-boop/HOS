"use client";

import React, { useState } from "react";
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
  members: Member[];
}

interface Submission {
  id: string;
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

  const tabs = [
    { id: "home", name: "Home", count: null },
    { id: "submissions", name: "Submissions", count: submissions.length },
    { id: "teams", name: "Teams", count: teams.length },
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
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="font-extrabold text-zinc-550 text-xs uppercase tracking-wider">Competing Teams</h3>
            
            {teams.length === 0 ? (
              <div className="bg-white border border-zinc-300 rounded-none p-16 text-center shadow-sm">
                <Users className="w-10 h-10 text-zinc-200 mx-auto mb-3" />
                <p className="text-xs font-bold text-zinc-500">No teams competing yet</p>
                <p className="text-[11px] text-zinc-400 mt-1">Once teams register, they will be listed here.</p>
              </div>
            ) : (
              <div className="bg-white border border-zinc-300 rounded-none shadow-sm overflow-x-auto w-full">
                <table className="min-w-full divide-y divide-zinc-200 text-left text-xs">
                  <thead className="bg-zinc-50 text-[10px] font-extrabold uppercase tracking-wider text-zinc-500">
                    <tr>
                      <th className="px-6 py-4">Team Name</th>
                      <th className="px-6 py-4">Team Lead</th>
                      <th className="px-6 py-4">Contact</th>
                      <th className="px-6 py-4">Members</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-150 bg-white text-zinc-700">
                    {teams.map((team) => (
                      <tr key={team.id} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-zinc-950">{team.teamName}</td>
                        <td className="px-6 py-4 font-semibold">{team.teamLeadName}</td>
                        <td className="px-6 py-4 font-normal text-zinc-500">{team.email}</td>
                        <td className="px-6 py-4">
                          {team.members.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {team.members.map((m) => (
                                <span key={m.id} className="bg-zinc-100 text-zinc-650 px-2 py-0.5 border border-zinc-200 text-[10px] font-medium" title={m.email}>
                                  {m.fullName}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-zinc-400 text-[10px]">Lead Only</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
    </div>
  );
}
