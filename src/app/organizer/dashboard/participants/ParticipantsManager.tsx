"use client";

import { useState } from "react";
import RegistrationStatusActions from "./RegistrationStatusActions";
import { Mail, Phone, Calendar, Search } from "lucide-react";

interface ParticipantInfo {
  fullName: string;
  email: string;
  phone: string | null;
}

interface HackathonInfo {
  title: string;
}

interface RegistrationData {
  id: string;
  registeredAt: Date | string;
  ticketTierName: string | null;
  paymentMode: string | null;
  ticketPriceINR: number | null;
  transactionId: string | null;
  paymentStatus: string;
  participant: ParticipantInfo;
  hackathon: HackathonInfo;
}

interface Props {
  initialRegistrations: RegistrationData[];
}

export default function ParticipantsManager({ initialRegistrations }: Props) {
  const [search, setSearch] = useState("");

  const filtered = initialRegistrations.filter((reg) => {
    const term = search.toLowerCase().trim();
    if (!term) return true;
    return (
      reg.participant.fullName.toLowerCase().includes(term) ||
      reg.participant.email.toLowerCase().includes(term) ||
      reg.hackathon.title.toLowerCase().includes(term) ||
      (reg.ticketTierName && reg.ticketTierName.toLowerCase().includes(term)) ||
      (reg.paymentMode && reg.paymentMode.toLowerCase().includes(term)) ||
      (reg.transactionId && reg.transactionId.toLowerCase().includes(term)) ||
      reg.paymentStatus.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-4">
      {/* Search Input Bar (Sharp & Red Block) */}
      <div className="bg-[#E61E32] border border-[#c91527] p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm rounded-none">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/80" />
          <input
            type="text"
            placeholder="Search by name, email, event..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-white/20 rounded-none pl-9 pr-4 py-2 text-xs font-semibold focus:outline-none focus:border-white/60 bg-white/10 text-white placeholder-white/60"
          />
        </div>
        <div className="flex items-center justify-between w-full sm:w-auto">
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 border border-white/20 bg-white/10 text-white rounded-none">
            {filtered.length} of {initialRegistrations.length} Matched
          </span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-zinc-300 rounded-none p-12 text-center flex flex-col items-center justify-center min-h-[250px] shadow-sm">
          <h3 className="text-sm font-bold text-zinc-900 mb-1">
            No Match Found
          </h3>
          <p className="text-zinc-500 text-xs max-w-xs leading-relaxed">
            Your search query did not match any registrations. Try adjusting terms.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-zinc-300 rounded-none shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px] text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-300 text-[10px] font-extrabold uppercase tracking-widest text-zinc-700">
                <th className="py-3.5 px-5 border-r border-zinc-200">Name</th>
                <th className="py-3.5 px-5 border-r border-zinc-200">Contact Info</th>
                <th className="py-3.5 px-5 border-r border-zinc-200">Registered Event</th>
                <th className="py-3.5 px-5 border-r border-zinc-200">Ticket / Pass</th>
                <th className="py-3.5 px-5 border-r border-zinc-200 w-28">Amount</th>
                <th className="py-3.5 px-5 border-r border-zinc-200 w-44">UTR / Reference</th>
                <th className="py-3.5 px-5 border-r border-zinc-200 w-44">Registered Date</th>
                <th className="py-3.5 px-5 w-32">Payment Status</th>
              </tr>
            </thead>
            <tbody className="text-xs font-semibold text-zinc-700">
              {filtered.map((reg) => {
                const regDate = new Date(reg.registeredAt).toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <tr
                    key={reg.id}
                    className="border-b border-zinc-200 last:border-0 hover:bg-zinc-50/60 transition-colors bg-white"
                  >
                    {/* Name */}
                    <td className="py-4 px-5 font-bold text-zinc-900 border-r border-zinc-200">
                      {reg.participant.fullName}
                    </td>

                    {/* Contact Info */}
                    <td className="py-4 px-5 border-r border-zinc-200">
                      <div className="space-y-1">
                        <span className="flex items-center gap-1.5 text-zinc-800">
                          <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" strokeWidth={2} />
                          {reg.participant.email}
                        </span>
                        <span className="flex items-center gap-1.5 text-zinc-400 font-normal text-[10px]">
                          <Phone className="w-3.5 h-3.5 text-zinc-300 shrink-0" strokeWidth={2} />
                          {reg.participant.phone || "No Phone"}
                        </span>
                      </div>
                    </td>

                    {/* Registered Event */}
                    <td className="py-4 px-5 border-r border-zinc-200 font-bold text-[#E61E32]">
                      {reg.hackathon.title}
                    </td>

                    {/* Ticket / Pass */}
                    <td className="py-4 px-5 border-r border-zinc-200">
                      <span className="font-bold text-zinc-900 block">
                        {reg.ticketTierName || "General Entry"}
                      </span>
                      <span className="text-[9px] text-zinc-400 font-extrabold uppercase tracking-wider block mt-0.5">
                        {reg.paymentMode || "FREE"}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-5 border-r border-zinc-200 text-zinc-900 font-extrabold tabular-nums">
                      {reg.ticketPriceINR !== null ? `₹${reg.ticketPriceINR}` : "₹0"}
                    </td>

                    {/* UTR / Reference */}
                    <td className="py-4 px-5 border-r border-zinc-200 font-mono text-zinc-650 text-[11px] select-all">
                      {reg.transactionId || "—"}
                    </td>

                    {/* Registered Date */}
                    <td className="py-4 px-5 border-r border-zinc-200 text-zinc-550 font-normal">
                      {regDate}
                    </td>

                    {/* Payment Status Actions */}
                    <td className="py-4 px-5">
                      <RegistrationStatusActions
                        registrationId={reg.id}
                        initialStatus={reg.paymentStatus}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Footer */}
          <div className="bg-zinc-50 border-t border-zinc-200 px-5 py-2.5">
            <p className="text-[10px] text-zinc-400 font-semibold">
              Use the actions in the Payment Status column to verify or reject manual participant ticket payments.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
