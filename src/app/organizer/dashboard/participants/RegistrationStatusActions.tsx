"use client";

import { useState } from "react";
import { updateRegistrationStatusAction } from "../../../actions/register-actions";

interface RegistrationStatusActionsProps {
  registrationId: string;
  initialStatus: string;
}

export default function RegistrationStatusActions({
  registrationId,
  initialStatus,
}: RegistrationStatusActionsProps) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (newStatus: "Verified" | "Rejected") => {
    setLoading(true);
    try {
      const res = await updateRegistrationStatusAction(registrationId, newStatus);
      if (res.success) {
        setStatus(newStatus);
      } else {
        alert(res.error || "Failed to update status.");
      }
    } catch (e) {
      alert("An error occurred while updating status.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "Verified") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold uppercase">
        <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
        Verified
      </span>
    );
  }

  if (status === "Rejected") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold uppercase">
        <svg className="w-3.5 h-3.5 text-red-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Rejected
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold uppercase mr-1">
        Pending
      </span>
      
      <button
        onClick={() => handleUpdate("Verified")}
        disabled={loading}
        title="Verify Registration"
        className="p-1 border border-zinc-200 hover:border-green-300 hover:bg-green-50 text-zinc-400 hover:text-green-600 rounded-none transition-colors disabled:opacity-50 cursor-pointer animate-none"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </button>
 
      <button
        onClick={() => handleUpdate("Rejected")}
        disabled={loading}
        title="Reject Registration"
        className="p-1 border border-zinc-200 hover:border-red-300 hover:bg-red-50 text-zinc-400 hover:text-red-600 rounded-none transition-colors disabled:opacity-50 cursor-pointer animate-none"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
