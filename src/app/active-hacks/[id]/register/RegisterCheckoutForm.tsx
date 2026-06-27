"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerParticipantAction } from "../../../actions/register-actions";

interface TicketTier {
  id: string;
  name: string;
  priceINR: number;
}

interface RegisterCheckoutFormProps {
  hackathonId: string;
  hackathonTitle: string;
  ticketTiers: TicketTier[];
  qrCodeUrl: string | null;
  preselectedTierId: string | null;
}

export default function RegisterCheckoutForm({
  hackathonId,
  hackathonTitle,
  ticketTiers,
  qrCodeUrl,
  preselectedTierId,
}: RegisterCheckoutFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Fallback if no ticket tiers are provided
  const tiersList = ticketTiers.length > 0 ? ticketTiers : [
    { id: "free", name: "General Admission", priceINR: 0 }
  ];

  // Try to find preselected tier, otherwise use first tier
  const initialTier = preselectedTierId
    ? tiersList.find(t => t.id === preselectedTierId) || tiersList[0]
    : tiersList[0];

  const [selectedTier, setSelectedTier] = useState<TicketTier>(initialTier);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [paymentMode, setPaymentMode] = useState("UPI");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Re-sync selected tier if preselectedTierId changes
  useEffect(() => {
    if (preselectedTierId) {
      const match = tiersList.find(t => t.id === preselectedTierId);
      if (match) setSelectedTier(match);
    }
  }, [preselectedTierId]);

  const handleNext = () => {
    setError("");
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!fullName.trim() || !email.trim()) {
        setError("Full Name and Email are required.");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("Please enter a valid email address.");
        return;
      }

      // If selected tier is free (0 INR), register directly
      if (selectedTier.priceINR === 0) {
        submitFreeRegistration();
      } else {
        setStep(3);
      }
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handleBack = () => {
    setError("");
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const submitFreeRegistration = async () => {
    setLoading(true);
    try {
      const result = await registerParticipantAction({
        hackathonId,
        ticketTierName: selectedTier.name,
        ticketPriceINR: selectedTier.priceINR,
        fullName,
        email,
        phone,
        transactionId: "FREE_PASS_" + Math.random().toString(36).substring(2, 9).toUpperCase(),
        paymentMode: "FREE",
      });

      if (result.success) {
        setStep(5);
      } else {
        setError(result.error || "Failed to complete registration.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!transactionId.trim()) {
      setError("Please fill in your Payment Transaction ID / UTR.");
      return;
    }

    setLoading(true);
    try {
      const result = await registerParticipantAction({
        hackathonId,
        ticketTierName: selectedTier.name,
        ticketPriceINR: selectedTier.priceINR,
        fullName,
        email,
        phone,
        transactionId,
        paymentMode,
      });

      if (result.success) {
        setStep(5);
      } else {
        setError(result.error || "Failed to complete registration.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans">
      {/* Simplify header for checkout */}
      <header className="sticky top-0 z-50 w-full bg-[#E61E32] border-b border-zinc-200 px-6 py-2.5 flex items-center justify-between gap-4 shrink-0 shadow-sm">
        <div className="flex items-center gap-2">
          <Link href={`/active-hacks/${hackathonId}`} className="font-semibold text-lg tracking-tight text-white hover:text-red-100 transition-colors">
            HackOS
          </Link>
          <span className="text-red-200 text-sm font-normal">/</span>
          <span className="text-white text-sm font-semibold truncate max-w-[200px] sm:max-w-xs">{hackathonTitle} Checkout</span>
        </div>
        <Link
          href={`/active-hacks/${hackathonId}`}
          className="text-white hover:text-red-100 text-xs font-bold transition-colors"
        >
          Cancel & Exit
        </Link>
      </header>

      <main className="max-w-5xl w-full mx-auto p-4 md:p-8 flex-1 flex flex-col gap-6">
        
        {/* Back navigation link */}
        <div className="shrink-0">
          <Link
            href={`/active-hacks/${hackathonId}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-[#E61E32] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Event Details
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Checkout Panel (7 columns on large screen) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
            
            {/* Step Progress Line */}
            <div className="w-full bg-zinc-100 h-1">
              <div
                className="bg-[#E61E32] h-full transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>

            <div className="p-6 md:p-8 space-y-6">
              
              {/* Step indicator nodes */}
              {step < 5 && (
                <div className="flex justify-between items-center text-center text-[10px] font-bold text-zinc-400 border-b border-zinc-100 pb-5">
                  <div className={`flex flex-col items-center gap-1 ${step >= 1 ? "text-[#E61E32]" : ""}`}>
                    <span className={`w-5.5 h-5.5 flex items-center justify-center rounded-full border ${step >= 1 ? "border-[#E61E32] bg-red-50 font-black" : "border-zinc-200"}`}>1</span>
                    <span>Select Pass</span>
                  </div>
                  <div className="flex-1 h-[1px] bg-zinc-200 mx-2" />
                  <div className={`flex flex-col items-center gap-1 ${step >= 2 ? "text-[#E61E32]" : ""}`}>
                    <span className={`w-5.5 h-5.5 flex items-center justify-center rounded-full border ${step >= 2 ? "border-[#E61E32] bg-red-50 font-black" : "border-zinc-200"}`}>2</span>
                    <span>Competitor Info</span>
                  </div>
                  <div className="flex-1 h-[1px] bg-zinc-200 mx-2" />
                  <div className={`flex flex-col items-center gap-1 ${step >= 3 ? "text-[#E61E32]" : ""}`}>
                    <span className={`w-5.5 h-5.5 flex items-center justify-center rounded-full border ${step >= 3 ? "border-[#E61E32] bg-red-50 font-black" : "border-zinc-200"}`}>3</span>
                    <span>Scan & Pay</span>
                  </div>
                  <div className="flex-1 h-[1px] bg-zinc-200 mx-2" />
                  <div className={`flex flex-col items-center gap-1 ${step >= 4 ? "text-[#E61E32]" : ""}`}>
                    <span className={`w-5.5 h-5.5 flex items-center justify-center rounded-full border ${step >= 4 ? "border-[#E61E32] bg-red-50 font-black" : "border-zinc-200"}`}>4</span>
                    <span>Verification</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-start gap-2.5 shadow-sm">
                  <svg className="w-4.5 h-4.5 shrink-0 mt-0.5 text-red-650" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* STEP 1: SELECT TIER */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-zinc-900 text-lg">Select Registration Pass</h3>
                    <p className="text-zinc-500 text-xs mt-0.5">Choose the ticket category for registration entry.</p>
                  </div>
                  
                  <div className="space-y-3 pt-2">
                    {tiersList.map((tier) => (
                      <div
                        key={tier.id}
                        onClick={() => setSelectedTier(tier)}
                        className={`flex items-center justify-between p-5 rounded-lg border-2 cursor-pointer transition-all hover:bg-zinc-50/50 ${
                          selectedTier.id === tier.id
                            ? "border-[#E61E32] bg-red-50/10 shadow-sm"
                            : "border-zinc-200 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="ticketTier"
                            checked={selectedTier.id === tier.id}
                            onChange={() => setSelectedTier(tier)}
                            className="text-[#E61E32] focus:ring-[#E61E32]"
                          />
                          <div>
                            <span className="font-bold text-sm text-zinc-900 block">{tier.name}</span>
                            <span className="text-[10px] text-zinc-400 uppercase font-semibold">INR Registration Entry</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-lg font-black text-zinc-900 block">₹{tier.priceINR}</span>
                          <span className="text-[9px] text-zinc-400 font-medium">incl. processing fees</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: COMPETITOR DETAILS */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-zinc-900 text-lg">Enter Competitor Information</h3>
                    <p className="text-zinc-500 text-xs mt-0.5">Specify candidate details for ticketing credentials.</p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Full Name</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg text-sm text-zinc-900 focus:outline-none focus:border-[#E61E32] focus:ring-1 focus:ring-[#E61E32] transition-all bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg text-sm text-zinc-900 focus:outline-none focus:border-[#E61E32] focus:ring-1 focus:ring-[#E61E32] transition-all bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Phone Number (Optional)</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 9876543210"
                        className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg text-sm text-zinc-900 focus:outline-none focus:border-[#E61E32] focus:ring-1 focus:ring-[#E61E32] transition-all bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: SCAN QR CODE */}
              {step === 3 && (
                <div className="space-y-5 text-center">
                  <div className="text-left space-y-0.5">
                    <h3 className="font-semibold text-zinc-900 text-lg">Scan QR Code to Pay</h3>
                    <p className="text-zinc-500 text-xs">Scan the code below with GPay, PhonePe, Paytm, BHIM, or any UPI app.</p>
                  </div>

                  <div className="bg-zinc-50 p-6 border border-zinc-200 rounded-lg inline-flex flex-col items-center justify-center max-w-sm mx-auto shadow-inner">
                    {qrCodeUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={qrCodeUrl}
                        alt="Payment QR Code"
                        className="w-56 h-56 object-contain bg-white border border-zinc-200 p-2.5 rounded-lg shadow-sm"
                      />
                    ) : (
                      <div className="w-56 h-56 bg-zinc-200 border border-dashed border-zinc-300 rounded-lg flex flex-col items-center justify-center p-4">
                        <svg className="w-12 h-12 text-zinc-400 mb-2.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                        </svg>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">No QR Code Uploaded</span>
                        <span className="text-[9px] text-zinc-400 mt-1">Please ask event organizer or complete registration.</span>
                      </div>
                    )}

                    <div className="mt-4 space-y-1">
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Total Due</span>
                      <span className="text-3xl font-black text-[#E61E32]">₹{selectedTier.priceINR}</span>
                      <span className="text-[10px] text-zinc-500 font-bold block mt-0.5">Selected Pass: {selectedTier.name}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-200 text-amber-850 rounded-lg text-left text-xs leading-relaxed max-w-md mx-auto shadow-sm">
                    <strong>Important:</strong> After paying, make sure to copy/save the transaction reference ID or UTR number from your payment app receipt. You will submit it in the next step to verify registration.
                  </div>
                </div>
              )}

              {/* STEP 4: VERIFICATION DETAILS */}
              {step === 4 && (
                <form onSubmit={handlePaidSubmit} className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-zinc-900 text-lg">Submit Payment Verification</h3>
                    <p className="text-zinc-500 text-xs mt-0.5">Enter transaction metadata so the organizer can approve your pass.</p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Payment Mode</label>
                      <select
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                        className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg text-sm text-zinc-900 focus:outline-none focus:border-[#E61E32] focus:ring-1 focus:ring-[#E61E32] bg-white transition-all"
                      >
                        <option value="UPI">UPI (GPay / PhonePe / Paytm / BHIM)</option>
                        <option value="Card">Credit / Debit Card</option>
                        <option value="NetBanking">Net Banking</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Transaction ID / UTR Number</label>
                      <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="e.g. 320512345678"
                        className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg text-sm text-zinc-900 focus:outline-none focus:border-[#E61E32] focus:ring-1 focus:ring-[#E61E32] transition-all bg-white font-mono"
                        required
                      />
                      <span className="text-[10px] text-zinc-400 mt-1.5 block">Ensure you input the transaction code exactly as shown in your receipt.</span>
                    </div>

                    <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg space-y-1.5 text-xs shadow-inner">
                      <div className="flex justify-between font-medium">
                        <span className="text-zinc-500">Ticket Tier:</span>
                        <span className="text-zinc-800 font-bold">{selectedTier.name}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span className="text-zinc-500">Price Paid:</span>
                        <span className="text-[#E61E32] font-black">₹{selectedTier.priceINR}</span>
                      </div>
                    </div>
                  </div>

                  {/* Step Footer Actions (Step 4 only) */}
                  <div className="border-t border-zinc-100 pt-6 mt-6 flex justify-between gap-3">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-5 py-2.5 border border-zinc-300 text-zinc-650 hover:bg-zinc-50 hover:border-zinc-400 font-bold rounded text-xs transition-colors cursor-pointer select-none"
                      disabled={loading}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#E61E32] hover:bg-[#c91527] text-white font-bold rounded text-xs transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer select-none"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        "Submit & Complete"
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 5: SUCCESS DETAILS */}
              {step === 5 && (
                <div className="text-center py-8 space-y-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto ring-8 ring-green-50/50">
                    <svg className="w-8 h-8 text-green-650" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-zinc-900 tracking-tight">Registration Submitted!</h3>
                    <p className="text-zinc-500 text-xs max-w-sm mx-auto leading-relaxed">
                      Your paid registration ticket has been received. The organizer will verify your payment UTR reference code shortly.
                    </p>
                  </div>

                  <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-xl text-left max-w-sm mx-auto text-xs space-y-3 shadow-inner">
                    <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider block border-b border-zinc-200 pb-2">Registration Receipt</span>
                    
                    <div className="flex justify-between">
                      <span className="text-zinc-400 font-medium">Competitor Name:</span>
                      <span className="text-zinc-800 font-bold">{fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400 font-medium">Email:</span>
                      <span className="text-zinc-800 font-medium">{email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400 font-medium">Pass Tier:</span>
                      <span className="text-zinc-800 font-bold">{selectedTier.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400 font-medium">Total Paid:</span>
                      <span className="text-[#E61E32] font-black">₹{selectedTier.priceINR}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400 font-medium">UTR Reference:</span>
                      <span className="text-zinc-700 font-mono text-[11px] font-bold select-all bg-white px-2 py-0.5 rounded border border-zinc-200 shadow-sm">{transactionId}</span>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={() => router.push(`/active-hacks/${hackathonId}`)}
                      className="px-6 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white font-bold rounded-lg text-xs transition-colors shadow cursor-pointer select-none"
                    >
                      Return to Event Page
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Step Footer Actions (Step 1, 2, 3 only) */}
            {step < 4 && (
              <div className="p-5 border-t border-zinc-100 flex justify-between gap-3 bg-zinc-50/50">
                <button
                  onClick={handleBack}
                  className="px-4 py-2 border border-zinc-300 text-zinc-650 hover:bg-zinc-50 hover:border-zinc-400 font-bold rounded text-xs transition-colors cursor-pointer select-none"
                  disabled={step === 1 || loading}
                  style={{ visibility: step === 1 ? "hidden" : "visible" }}
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="px-5 py-2 bg-[#E61E32] hover:bg-[#c91527] text-white font-bold rounded text-xs transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer select-none"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Loading...
                    </>
                  ) : (
                    "Next"
                  )}
                </button>
              </div>
            )}

          </div>

          {/* Sidebar Order Summary (5 columns on large screen) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-zinc-200 shadow-sm p-6 space-y-6 lg:sticky lg:top-28">
            <div>
              <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Event Registration</p>
              <h2 className="text-xl font-bold text-zinc-950 mt-1 leading-snug">{hackathonTitle}</h2>
            </div>

            <div className="border-t border-zinc-150 pt-5 space-y-4">
              <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 space-y-3">
                <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Order Break Down</p>
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-zinc-500">Selected Pass:</span>
                  <span className="text-zinc-800 font-bold">{selectedTier.name}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold border-t border-dashed border-zinc-200 pt-2.5 mt-2.5">
                  <span className="text-zinc-500">Ticket Price:</span>
                  <span className="text-zinc-900 font-bold">₹{selectedTier.priceINR}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-zinc-500">Processing Fees:</span>
                  <span className="text-green-700 font-bold">₹0 (Free)</span>
                </div>
                <div className="flex justify-between items-center text-sm font-extrabold border-t border-zinc-200 pt-3 mt-3">
                  <span className="text-zinc-900">Total Amount:</span>
                  <span className="text-[#E61E32] font-black text-base">₹{selectedTier.priceINR}</span>
                </div>
              </div>

              <div className="p-4 bg-red-50/10 border border-[#E61E32]/20 rounded-lg text-xs leading-relaxed text-zinc-600">
                Registering for this hackathon grants you access to compete and request validation. Payments are processed in Indian Rupees (INR) and are verified by the organizer.
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
