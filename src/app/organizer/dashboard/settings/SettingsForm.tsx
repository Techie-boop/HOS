"use client";

import { useActionState, startTransition, useState, useEffect } from "react";
import { updateProfileAction } from "../../../actions/profile-actions";

interface SettingsFormProps {
  initialData: {
    fullName: string;
    designation: string;
    organizationName: string;
    phone: string | null;
    website: string | null;
  };
}

export default function SettingsForm({ initialData }: SettingsFormProps) {
  const [state, formAction, isPending] = useActionState(updateProfileAction, null);
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    fullName: initialData.fullName,
    designation: initialData.designation,
    organizationName: initialData.organizationName,
    phone: initialData.phone || "",
    website: initialData.website || "",
  });

  useEffect(() => {
    if (state?.success) {
      setSuccessMsg("Profile settings updated successfully!");
      const currentPass = document.getElementById("currentPassword") as HTMLInputElement;
      const newPass = document.getElementById("newPassword") as HTMLInputElement;
      if (currentPass) currentPass.value = "";
      if (newPass) newPass.value = "";
      
      const timer = setTimeout(() => setSuccessMsg(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => {
      formAction(data);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm space-y-6 text-xs font-semibold">
      
      {successMsg && (
        <div className="bg-green-50 text-green-700 text-xs p-3 border-l-4 border-green-500 font-semibold animate-in fade-in duration-150">
          {successMsg}
        </div>
      )}

      {state?.error && (
        <div className="bg-red-50 text-red-600 text-xs p-3 border-l-4 border-red-500 font-semibold">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1.5">Full Name *</label>
          <input
            name="fullName"
            type="text"
            required
            value={formData.fullName}
            onChange={handleChange}
            className="w-full text-xs p-2.5 border border-zinc-200 bg-zinc-50 text-zinc-900 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32]"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1.5">Role / Designation *</label>
          <input
            name="designation"
            type="text"
            required
            value={formData.designation}
            onChange={handleChange}
            className="w-full text-xs p-2.5 border border-zinc-200 bg-zinc-50 text-zinc-900 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1.5">Organisation Name *</label>
          <input
            name="organizationName"
            type="text"
            required
            value={formData.organizationName}
            onChange={handleChange}
            className="w-full text-xs p-2.5 border border-zinc-200 bg-zinc-50 text-zinc-900 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32]"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1.5">Phone Number (optional)</label>
          <input
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="w-full text-xs p-2.5 border border-zinc-200 bg-zinc-50 text-zinc-900 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32]"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1.5">Organisation Website (optional)</label>
        <input
          name="website"
          type="url"
          value={formData.website}
          onChange={handleChange}
          className="w-full text-xs p-2.5 border border-zinc-200 bg-zinc-50 text-zinc-900 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32]"
        />
      </div>

      <div className="pt-6 border-t border-zinc-200 space-y-4">
        <h3 className="text-sm font-semibold text-zinc-800">Change Account Password</h3>
        <p className="text-zinc-505 text-[10px] font-normal leading-normal">
          To update your password, fill out both fields below. Otherwise, leave them blank.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1.5">Current Password</label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              placeholder="••••••••"
              className="w-full text-xs p-2.5 border border-zinc-200 bg-zinc-50 text-zinc-900 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32]"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1.5">New Password</label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="Min. 8 characters"
              className="w-full text-xs p-2.5 border border-zinc-200 bg-zinc-50 text-zinc-900 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32]"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-zinc-200">
        <button
          type="submit"
          disabled={isPending}
          className="bg-[#E61E32] hover:bg-[#c91527] text-white font-semibold py-2.5 px-6 text-xs rounded transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isPending ? "Saving changes..." : "Save Console Settings"}
        </button>
      </div>

    </form>
  );
}
