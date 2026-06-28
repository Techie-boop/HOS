"use client";

import { useState } from "react";
import { Award, CheckCircle, Clock, Video, UserCheck, ShieldCheck, Sparkles } from "lucide-react";

interface Judge {
  id: string;
  name: string;
  role: string;
  company: string;
  specialty: string[];
  status: "Available" | "Offline" | "In Review Session";
  avatar: string;
}

interface Request {
  id: string;
  type: string;
  judgeName: string;
  requestedAt: string;
  status: "Pending" | "Confirmed" | "Completed";
  notes?: string;
}

export default function TeamJuryPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedJudge, setSelectedJudge] = useState<Judge | null>(null);
  const [reviewType, setReviewType] = useState("Technical Critique");
  const [notes, setNotes] = useState("");

  const judges: Judge[] = [
    {
      id: "1",
      name: "Dr. Vikram Seth",
      role: "Lead Judge",
      company: "Google Cloud Director",
      specialty: ["Scalability", "System Design", "Kubernetes"],
      status: "Available",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    },
    {
      id: "2",
      name: "Sarah Jenkins",
      role: "UX/UI Evaluator",
      company: "Principal Designer at Figma",
      specialty: ["User Experience", "Interface Polish", "Accessibility"],
      status: "In Review Session",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    },
    {
      id: "3",
      name: "Marcus Chen",
      role: "Jury Member",
      company: "VP of Engineering at Neon DB",
      specialty: ["Database Architecture", "Serverless", "Security"],
      status: "Available",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    },
    {
      id: "4",
      name: "Elena Rostova",
      role: "Product Judge",
      company: "Partner at Y Combinator",
      specialty: ["Go-to-Market", "Business Model", "Presentation Pitch"],
      status: "Offline",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80",
    },
  ];

  const [requests, setRequests] = useState<Request[]>([
    {
      id: "REQ-01",
      type: "Database Schema Check",
      judgeName: "Marcus Chen",
      requestedAt: "Yesterday at 3:15 PM",
      status: "Completed",
      notes: "Reviewed schema. Prisma adapter configuration is solid. Advised adding indexes on critical UUID fields.",
    },
    {
      id: "REQ-02",
      type: "Technical Critique",
      judgeName: "Dr. Vikram Seth",
      requestedAt: "Today at 11:30 AM",
      status: "Confirmed",
      notes: "Session scheduled for 3:00 PM today via HackOS Video Link.",
    },
  ]);

  const handleRequestReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJudge) return;

    const newReq: Request = {
      id: `REQ-0${requests.length + 1}`,
      type: reviewType,
      judgeName: selectedJudge.name,
      requestedAt: "Just now",
      status: "Pending",
      notes: notes.trim() ? notes : "Waiting for judge to assign session link.",
    };

    setRequests((prev) => [newReq, ...prev]);
    setShowModal(false);
    setSelectedJudge(null);
    setNotes("");
  };

  const getStatusStyle = (status: Request["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-250";
      case "Confirmed":
        return "bg-sky-50 text-sky-700 border-sky-250";
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-250";
    }
  };

  return (
    <div className="flex-grow p-6 md:p-8 max-w-[1400px] w-full space-y-8 animate-in fade-in duration-200">
      
      {/* Header Info */}
      <section className="bg-white border border-zinc-200 rounded-none p-5 shadow-sm flex flex-col justify-between items-start gap-1">
        <span className="text-[10px] uppercase tracking-widest text-[#E61E32] font-extrabold">Jury Connection & Pitch Hub</span>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900 mt-1">
          Connect with the HackOS Jury
        </h2>
        <p className="text-xs text-zinc-500 font-normal mt-0.5 leading-relaxed max-w-2xl">
          Get direct mentoring, pitch critique, and architectural evaluations from active judges. Request a slot below.
        </p>
      </section>

      {/* Jury Grid */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-zinc-800 tracking-tight flex items-center gap-2">
          <Award className="w-4 h-4 text-[#E61E32]" />
          Jury Panel Directory
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {judges.map((judge) => (
            <div
              key={judge.id}
              className="bg-white border border-zinc-200 rounded-none p-4 flex flex-col justify-between gap-4 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <img
                  src={judge.avatar}
                  alt={judge.name}
                  className="w-12 h-12 object-cover border border-zinc-250 grayscale-40 hover:grayscale-0 transition-all duration-300"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-zinc-900 truncate">{judge.name}</h4>
                  <p className="text-[10px] text-zinc-500 font-bold truncate mt-0.5">{judge.role}</p>
                  <p className="text-[10px] text-zinc-400 font-normal truncate">{judge.company}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {judge.specialty.map((spec) => (
                    <span
                      key={spec}
                      className="bg-zinc-100 text-zinc-650 text-[9px] font-bold px-1.5 py-0.5 rounded-none"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-none shrink-0 ${
                    judge.status === "Available"
                      ? "bg-emerald-500 animate-pulse"
                      : judge.status === "In Review Session"
                      ? "bg-amber-500"
                      : "bg-zinc-350"
                  }`} />
                  <span className="text-[10px] text-zinc-500 font-semibold">{judge.status}</span>
                </div>
              </div>

              <button
                disabled={judge.status === "Offline"}
                onClick={() => {
                  setSelectedJudge(judge);
                  setShowModal(true);
                }}
                className={`w-full py-1.5 text-[10px] font-bold tracking-tight text-center rounded-none shadow-sm cursor-pointer transition-all ${
                  judge.status === "Offline"
                    ? "bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed"
                    : "bg-[#E61E32] hover:bg-[#c91527] text-white border border-[#c91527]"
                }`}
              >
                Request Consultation
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Requests History List */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-zinc-800 tracking-tight flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-[#E61E32]" />
          Team Request Log
        </h3>
        
        <div className="bg-white border border-zinc-200 rounded-none shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 font-bold text-zinc-500 text-[10px] uppercase tracking-wider">
                <th className="p-3">Req ID</th>
                <th className="p-3">Consultation Type</th>
                <th className="p-3">Jury Member</th>
                <th className="p-3">Requested At</th>
                <th className="p-3">Status</th>
                <th className="p-3">Jury Notes / Slot Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 font-medium text-zinc-700">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-zinc-50/50">
                  <td className="p-3 font-mono font-bold text-zinc-900">{req.id}</td>
                  <td className="p-3 font-bold">{req.type}</td>
                  <td className="p-3">{req.judgeName}</td>
                  <td className="p-3 text-zinc-500 font-normal">{req.requestedAt}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1 border text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm ${getStatusStyle(req.status)}`}>
                      {req.status === "Completed" && <CheckCircle className="w-3 h-3" />}
                      {req.status === "Confirmed" && <Video className="w-3 h-3 animate-pulse" />}
                      {req.status === "Pending" && <Clock className="w-3 h-3" />}
                      {req.status}
                    </span>
                  </td>
                  <td className="p-3 text-zinc-600 font-normal leading-relaxed max-w-sm">
                    {req.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Request Modal */}
      {showModal && selectedJudge && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-300 w-full max-w-md p-6 rounded-none shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-200">
              <h3 className="text-sm font-black text-zinc-900 flex items-center gap-2 uppercase tracking-wide">
                <Sparkles className="w-4 h-4 text-[#E61E32]" />
                Request Consultation
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedJudge(null);
                }}
                className="text-zinc-400 hover:text-zinc-655 font-bold cursor-pointer text-xs"
              >
                ✖
              </button>
            </div>
            
            <form onSubmit={handleRequestReview} className="space-y-4 pt-4">
              <div className="bg-zinc-50 border border-zinc-200 p-3 flex gap-3 items-center">
                <img
                  src={selectedJudge.avatar}
                  alt={selectedJudge.name}
                  className="w-10 h-10 object-cover border border-zinc-300"
                />
                <div>
                  <h4 className="text-xs font-bold text-zinc-900">{selectedJudge.name}</h4>
                  <p className="text-[10px] text-zinc-500">{selectedJudge.company}</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-extrabold text-zinc-400">
                  Review Topic
                </label>
                <select
                  value={reviewType}
                  onChange={(e) => setReviewType(e.target.value)}
                  className="w-full bg-zinc-55 border border-zinc-200 text-xs px-3 py-2 focus:outline-none focus:border-[#E61E32] font-semibold"
                >
                  <option value="Technical Critique">Technical Critique & DB Schema Review</option>
                  <option value="UI & UX Polish">UI/UX Audit & Accessibility Review</option>
                  <option value="Pitch Presentation">Slide Deck & Pitch Prep</option>
                  <option value="Final Demo Review">Deployment Check & Demo Review</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-extrabold text-zinc-400">
                  Message / Context for the Judge
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Explain briefly what you'd like the judge to look at (e.g. schema.prisma structure, user flow)..."
                  rows={4}
                  className="w-full bg-zinc-55 border border-zinc-200 text-xs p-3 focus:outline-none focus:border-[#E61E32] font-normal leading-relaxed"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedJudge(null);
                  }}
                  className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-800 border border-zinc-200 cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#E61E32] hover:bg-[#c91527] text-white px-5 py-2 text-xs font-bold border border-[#c91527] cursor-pointer shadow-sm transition-all"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
