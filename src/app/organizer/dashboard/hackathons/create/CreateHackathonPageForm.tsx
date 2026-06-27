"use client";

import { useActionState, startTransition, useState, useEffect } from "react";
import { createHackathonAction } from "../../../../actions/hackathon-actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface PrizeItem {
  id: string;
  title: string;
  value: string;
  description: string;
}

export default function CreateHackathonPageForm() {
  const [state, formAction, isPending] = useActionState(createHackathonAction, null);
  const router = useRouter();

  // Dynamic prizes state
  const [prizes, setPrizes] = useState<PrizeItem[]>([
    { id: "1", title: "1st Place Winner", value: "$5,000", description: "Top performing team overall" },
    { id: "2", title: "Runner Up", value: "$2,500", description: "Second place overall" }
  ]);

  // Dynamic ticket tiers state
  const [ticketTiers, setTicketTiers] = useState<Array<{ id: string; name: string; priceINR: string }>>([
    { id: "1", name: "Regular Entry", priceINR: "299" }
  ]);

  // Overall prize pool input state
  const [prizePool, setPrizePool] = useState("$7,500");

  // Redirect on successful creation
  useEffect(() => {
    if (state?.success) {
      router.push("/organizer/dashboard/hackathons");
      router.refresh();
    }
  }, [state, router]);

  // Dynamically calculate total prize pool based on values
  useEffect(() => {
    let total = 0;
    let hasNumeric = false;
    prizes.forEach(p => {
      const num = parseFloat(p.value.replace(/[\$,\s]/g, ""));
      if (!isNaN(num)) {
        total += num;
        hasNumeric = true;
      }
    });
    if (hasNumeric) {
      setPrizePool(`$${total.toLocaleString()}`);
    } else if (prizes.length === 0) {
      setPrizePool("$0");
    }
  }, [prizes]);

  const addPrize = () => {
    setPrizes([
      ...prizes,
      { id: crypto.randomUUID(), title: "", value: "", description: "" }
    ]);
  };

  const removePrize = (id: string) => {
    setPrizes(prizes.filter(p => p.id !== id));
  };

  const updatePrize = (id: string, field: keyof PrizeItem, val: string) => {
    setPrizes(prizes.map(p => p.id === id ? { ...p, [field]: val } : p));
  };

  const addTicketTier = () => {
    setTicketTiers([
      ...ticketTiers,
      { id: crypto.randomUUID(), name: "", priceINR: "" }
    ]);
  };

  const removeTicketTier = (id: string) => {
    setTicketTiers(ticketTiers.filter(t => t.id !== id));
  };

  const updateTicketTier = (id: string, field: "name" | "priceINR", val: string) => {
    setTicketTiers(ticketTiers.map(t => t.id === id ? { ...t, [field]: val } : t));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Add prizes array serialized as JSON
    const prizesToSend = prizes.map(({ title, value, description }) => ({
      title,
      value,
      description
    }));
    formData.append("prizes", JSON.stringify(prizesToSend));

    // Add ticket tiers array serialized as JSON
    const tiersToSend = ticketTiers.map(({ name, priceINR }) => ({
      name,
      priceINR: Math.max(0, Math.round(Number(priceINR) || 0))
    }));
    formData.append("ticketTiers", JSON.stringify(tiersToSend));
    
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-xs font-semibold">
      
      {state?.error && (
        <div className="bg-red-50 text-red-600 text-xs p-3 border-l-4 border-red-500 font-semibold animate-in fade-in duration-150">
          {state.error}
        </div>
      )}

      {/* Main Grid Card: Form Fields */}
      <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm space-y-6">
        
        {/* Section 1: General Details */}
        <div>
          <h3 className="text-sm font-semibold text-zinc-800 mb-4 border-b border-zinc-150 pb-2">
            1. General Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1.5">
                Event Title *
              </label>
              <input
                name="title"
                type="text"
                required
                placeholder="e.g. HackOS Global 2026"
                className="w-full text-xs p-2.5 border border-zinc-200 bg-zinc-50 text-zinc-900 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1.5">
                  Tag / Type
                </label>
                <select
                  name="tag"
                  className="w-full text-xs p-2.5 border border-zinc-200 bg-zinc-50 text-zinc-900 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32]"
                >
                  <option value="Regional">Regional</option>
                  <option value="International">International</option>
                  <option value="Specialized">Specialized</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1.5">
                  Launch Status
                </label>
                <select
                  name="status"
                  className="w-full text-xs p-2.5 border border-zinc-200 bg-zinc-50 text-zinc-900 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32]"
                >
                  <option value="Draft">Draft (Only in Console)</option>
                  <option value="Active">Active (Accepting Registrations)</option>
                  <option value="Completed">Completed (Event Finished)</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-zinc-100">
            <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1.5">
              Banner Image URL (optional)
            </label>
            <input
              name="bannerUrl"
              type="url"
              placeholder="e.g. https://images.unsplash.com/photo-1504384308090-c894fdcc538d"
              className="w-full text-xs p-2.5 border border-zinc-200 bg-zinc-50 text-zinc-900 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32]"
            />
            <p className="text-[10px] text-zinc-400 mt-1.5 font-normal">
              Provide an image URL to customize the header banner of your hackathon card. Leave blank for a default tech background.
            </p>
          </div>
        </div>

        {/* Section 2: Dates, Location, Links, Prize Pool */}
        <div>
          <h3 className="text-sm font-semibold text-zinc-800 mb-4 border-b border-zinc-150 pb-2">
            2. Schedule, Parameters & Links
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1.5">
                  Start Date *
                </label>
                <input
                  name="startDate"
                  type="date"
                  required
                  className="w-full text-xs p-2.5 border border-zinc-200 bg-zinc-50 text-zinc-900 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32]"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1.5">
                  End Date *
                </label>
                <input
                  name="endDate"
                  type="date"
                  required
                  className="w-full text-xs p-2.5 border border-zinc-200 bg-zinc-50 text-zinc-900 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1.5">
                  Location Name
                </label>
                <input
                  name="location"
                  type="text"
                  placeholder="e.g. Online, San Francisco"
                  className="w-full text-xs p-2.5 border border-zinc-200 bg-zinc-50 text-zinc-900 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32]"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1.5">
                  Total Prize Pool
                </label>
                <input
                  name="prizePool"
                  type="text"
                  value={prizePool}
                  onChange={(e) => setPrizePool(e.target.value)}
                  placeholder="e.g. $10,000"
                  className="w-full text-xs p-2.5 border border-zinc-200 bg-zinc-50 text-zinc-900 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1.5">
                Location Map / Stream Link (optional)
              </label>
              <input
                name="locationLink"
                type="url"
                placeholder="e.g. https://maps.google.com/?q=..."
                className="w-full text-xs p-2.5 border border-zinc-200 bg-zinc-50 text-zinc-900 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32]"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1.5">
                Ticketing Link (optional)
              </label>
              <input
                name="ticketingLink"
                type="url"
                placeholder="e.g. https://eventbrite.com/tickets..."
                className="w-full text-xs p-2.5 border border-zinc-200 bg-zinc-50 text-zinc-900 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pt-4 border-t border-dashed border-zinc-150">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1.5">
                Payment QR Code Image URL (optional)
              </label>
              <input
                name="qrCodeUrl"
                type="url"
                placeholder="e.g. https://domain.com/payment-qr.jpg"
                className="w-full text-xs p-2.5 border border-zinc-200 bg-zinc-50 text-zinc-900 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32]"
              />
              <p className="text-[10px] text-zinc-400 mt-1.5 font-normal">
                Image link of your payment QR Code for developers to scan and register.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Event Description */}
        <div>
          <h3 className="text-sm font-semibold text-zinc-800 mb-4 border-b border-zinc-150 pb-2">
            3. Description & Tracks
          </h3>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1.5">
              Description *
            </label>
            <textarea
              name="description"
              required
              rows={4}
              placeholder="Describe your event tracks, judges, rules, and hardware access details..."
              className="w-full text-xs p-2.5 border border-zinc-200 bg-zinc-50 text-zinc-900 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32] resize-none"
            />
          </div>
        </div>

        {/* Section 4: Registration Ticket Tiers (INR) */}
        <div>
          <div className="flex items-center justify-between mb-4 border-b border-zinc-150 pb-2">
            <h3 className="text-sm font-semibold text-zinc-800">
              4. Registration Ticket Tiers (INR)
            </h3>
            <button
              type="button"
              onClick={addTicketTier}
              className="flex items-center text-[#E61E32] hover:text-[#c91527] text-xs font-bold transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Ticket Tier
            </button>
          </div>

          {ticketTiers.length === 0 ? (
            <div className="border border-dashed border-zinc-200 rounded-lg p-6 text-center text-zinc-500 font-normal">
              No ticket tiers added. Click &quot;Add Ticket Tier&quot; above to declare custom entry prices (e.g. Free, Paid).
            </div>
          ) : (
            <div className="space-y-4">
              <div className="hidden md:grid grid-cols-12 gap-3 px-2 text-[10px] uppercase tracking-wider text-zinc-400">
                <div className="col-span-6">Ticket Tier Name *</div>
                <div className="col-span-5">Price (INR) *</div>
                <div className="col-span-1 text-center">Delete</div>
              </div>

              <div className="space-y-3">
                {ticketTiers.map((tier) => (
                  <div
                    key={tier.id}
                    className="grid grid-cols-12 gap-3 items-center bg-zinc-50/50 p-3 md:p-1 border border-zinc-100 md:border-none rounded-lg md:rounded-none"
                  >
                    <div className="col-span-12 md:col-span-6">
                      <label className="block md:hidden text-[9px] uppercase tracking-wider text-zinc-400 mb-1">
                        Ticket Tier Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Regular Entry"
                        value={tier.name}
                        onChange={(e) => updateTicketTier(tier.id, "name", e.target.value)}
                        className="w-full text-xs p-2 border border-zinc-200 bg-white text-zinc-900 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32]"
                      />
                    </div>

                    <div className="col-span-10 md:col-span-5">
                      <label className="block md:hidden text-[9px] uppercase tracking-wider text-zinc-400 mb-1">
                        Price (INR) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        required
                        placeholder="e.g. 299"
                        value={tier.priceINR}
                        onChange={(e) => updateTicketTier(tier.id, "priceINR", e.target.value)}
                        className="w-full text-xs p-2 border border-zinc-200 bg-white text-zinc-900 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32]"
                      />
                    </div>

                    <div className="col-span-2 md:col-span-1 flex justify-center items-center">
                      <button
                        type="button"
                        onClick={() => removeTicketTier(tier.id)}
                        className="p-2 text-zinc-400 hover:text-[#E61E32] border border-zinc-200 md:border-none rounded md:rounded-none bg-white md:bg-transparent transition-colors cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section 5: Prizes & Distribution */}
        <div>
          <div className="flex items-center justify-between mb-4 border-b border-zinc-150 pb-2">
            <h3 className="text-sm font-semibold text-zinc-800">
              5. Prizes & Distribution
            </h3>
            <button
              type="button"
              onClick={addPrize}
              className="flex items-center text-[#E61E32] hover:text-[#c91527] text-xs font-bold transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Prize Level
            </button>
          </div>

          {prizes.length === 0 ? (
            <div className="border border-dashed border-zinc-200 rounded-lg p-6 text-center text-zinc-500 font-normal">
              No specific prize levels added yet. Click &quot;Add Prize Level&quot; above to itemize awards.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Header Titles (Hidden on Mobile) */}
              <div className="hidden md:grid grid-cols-12 gap-3 px-2 text-[10px] uppercase tracking-wider text-zinc-400">
                <div className="col-span-3">Prize Level / Title *</div>
                <div className="col-span-3">Value / Prize *</div>
                <div className="col-span-5">Short Description</div>
                <div className="col-span-1 text-center">Delete</div>
              </div>

              {/* Rows */}
              <div className="space-y-3">
                {prizes.map((prize, idx) => (
                  <div
                    key={prize.id}
                    className="grid grid-cols-12 gap-3 items-center bg-zinc-50/50 p-3 md:p-1 border border-zinc-100 md:border-none rounded-lg md:rounded-none"
                  >
                    {/* Title */}
                    <div className="col-span-12 md:col-span-3">
                      <label className="block md:hidden text-[9px] uppercase tracking-wider text-zinc-400 mb-1">
                        Prize Level / Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 1st Place"
                        value={prize.title}
                        onChange={(e) => updatePrize(prize.id, "title", e.target.value)}
                        className="w-full text-xs p-2 border border-zinc-200 bg-white text-zinc-900 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32]"
                      />
                    </div>

                    {/* Value */}
                    <div className="col-span-12 md:col-span-3">
                      <label className="block md:hidden text-[9px] uppercase tracking-wider text-zinc-400 mb-1">
                        Value / Prize *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. $5,000 or Oculus VR"
                        value={prize.value}
                        onChange={(e) => updatePrize(prize.id, "value", e.target.value)}
                        className="w-full text-xs p-2 border border-zinc-200 bg-white text-zinc-900 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32]"
                      />
                    </div>

                    {/* Description */}
                    <div className="col-span-10 md:col-span-5">
                      <label className="block md:hidden text-[9px] uppercase tracking-wider text-zinc-400 mb-1">
                        Short Description
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Highest scoring web app track"
                        value={prize.description}
                        onChange={(e) => updatePrize(prize.id, "description", e.target.value)}
                        className="w-full text-xs p-2 border border-zinc-200 bg-white text-zinc-900 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32]"
                      />
                    </div>

                    {/* Delete Action */}
                    <div className="col-span-2 md:col-span-1 flex justify-center items-center">
                      <button
                        type="button"
                        onClick={() => removePrize(prize.id)}
                        title="Remove prize level"
                        className="p-2 text-zinc-400 hover:text-[#E61E32] border border-zinc-200 md:border-none rounded md:rounded-none bg-white md:bg-transparent transition-colors cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Footer Form Submission */}
      <div className="flex items-center justify-end gap-4 bg-white border border-zinc-200 rounded-lg p-4 shadow-sm">
        <Link
          href="/organizer/dashboard/hackathons"
          className="py-2.5 px-6 border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 text-xs font-semibold rounded transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="bg-[#E61E32] hover:bg-[#c91527] text-white font-semibold py-2.5 px-8 text-xs rounded transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
        >
          {isPending ? "Creating Hackathon..." : "Create Hackathon Console"}
        </button>
      </div>

    </form>
  );
}
