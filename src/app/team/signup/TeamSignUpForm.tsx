"use client";

import { useState, useActionState, startTransition } from "react";
import Link from "next/link";
import { teamSignUpAction } from "../../actions/team-auth-actions";
import { Trophy } from "lucide-react";

interface HackathonInfo {
  id: string;
  title: string;
}

interface TeamSignUpFormProps {
  hackathon: HackathonInfo;
}

export default function TeamSignUpForm({ hackathon }: TeamSignUpFormProps) {
  const [formData, setFormData] = useState({
    teamName: "",
    teamLeadName: "",
    email: "",
    password: "",
    confirmPassword: "",
    hackathonId: hackathon.id,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, formAction, isPending] = useActionState(teamSignUpAction, null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.teamName.trim()) e.teamName = "Team name is required";
    if (!formData.teamLeadName.trim()) e.teamLeadName = "Team lead name is required";
    if (!formData.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Enter a valid email address";
    if (!formData.password) e.password = "Password is required";
    else if (formData.password.length < 6) e.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) e.confirmPassword = "Passwords do not match";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    const data = new FormData();
    data.append("teamName", formData.teamName);
    data.append("teamLeadName", formData.teamLeadName);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("hackathonId", formData.hackathonId);

    startTransition(() => {
      formAction(data);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const FieldError = ({ field }: { field: string }) =>
    errors[field] ? <p className="mt-1.5 text-xs text-red-600">{errors[field]}</p> : null;

  return (
    <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white border border-zinc-200 shadow-sm min-h-[500px]">
      
      {/* Left Branding Panel */}
      <div 
        className="relative p-8 md:p-12 md:w-5/12 flex flex-col justify-between min-h-[350px] border-b md:border-b-0 md:border-r border-zinc-200 bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80")`
        }}
      >
        {/* Localized bottom gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent z-0" />

        <div className="relative z-10 self-start bg-white/95 backdrop-blur-md px-3 py-1 rounded shadow-sm border border-white/20">
          <span className="text-[10px] uppercase tracking-widest text-[#E61E32] font-extrabold">
            HackOS Platform
          </span>
        </div>

        <div className="mt-auto relative z-10 bg-black/45 backdrop-blur-md p-5 rounded border border-white/10 text-white">
          <h1 className="text-xl md:text-2xl font-bold leading-tight tracking-tight">
            Register your <span className="text-[#E61E32]">Team</span>.
          </h1>
          <p className="text-xs text-zinc-200 mt-1 max-w-xs font-normal">
            Sign up to represent your team and compete in active hackathons.
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="p-8 md:p-12 md:w-7/12 flex flex-col bg-white text-zinc-900 justify-center">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-6 font-medium">
          <Link href="/" className="hover:text-zinc-800 transition-colors">
            Home
          </Link>
          <span className="text-zinc-400">/</span>
          <Link href="/team/login" className="hover:text-zinc-800 transition-colors">
            Team Login
          </Link>
          <span className="text-zinc-400">/</span>
          <span className="text-zinc-800 font-semibold">
            Team Registration
          </span>
        </div>

        <div className="flex flex-col items-start mb-6">
          <h2 className="text-3xl font-medium mb-1 tracking-tight text-zinc-900">
            Team Registration
          </h2>
          <p className="text-left text-zinc-500 text-sm">
            Set up your team lead credentials and join a hackathon
          </p>
        </div>

        {state?.error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 border-l-4 border-red-500 mb-6 font-medium">
            {state.error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="teamName" className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-1.5">
                Team Name
              </label>
              <input
                type="text"
                id="teamName"
                name="teamName"
                placeholder="Team Hackers"
                className={`text-sm w-full py-2 px-3 border-2 bg-zinc-50 text-zinc-900 placeholder-zinc-400 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32] ${
                  errors.teamName ? "border-red-500" : "border-zinc-200"
                }`}
                value={formData.teamName}
                onChange={handleChange}
              />
              <FieldError field="teamName" />
            </div>

            <div>
              <label htmlFor="teamLeadName" className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-1.5">
                Team Lead Name
              </label>
              <input
                type="text"
                id="teamLeadName"
                name="teamLeadName"
                placeholder="John Doe"
                className={`text-sm w-full py-2 px-3 border-2 bg-zinc-50 text-zinc-900 placeholder-zinc-400 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32] ${
                  errors.teamLeadName ? "border-red-500" : "border-zinc-200"
                }`}
                value={formData.teamLeadName}
                onChange={handleChange}
              />
              <FieldError field="teamLeadName" />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="teamlead@gmail.com"
              className={`text-sm w-full py-2 px-3 border-2 bg-zinc-50 text-zinc-900 placeholder-zinc-400 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32] ${
                errors.email ? "border-red-500" : "border-zinc-200"
              }`}
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
            <FieldError field="email" />
          </div>

          <div>
            <span className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-1.5">
              Associated Hackathon
            </span>
            <div className="bg-zinc-50 border-2 border-zinc-200 py-2.5 px-3 text-sm text-zinc-950 font-bold flex items-center justify-between shadow-inner">
              <span className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-[#E61E32]" />
                {hackathon.title}
              </span>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 bg-[#E61E32] text-white rounded shadow-sm">
                Linked
              </span>
            </div>
            <input type="hidden" name="hackathonId" value={formData.hackathonId} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Password"
                  className={`text-sm w-full py-2 px-3 pr-10 border-2 bg-zinc-50 text-zinc-900 placeholder-zinc-400 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32] ${
                    errors.password ? "border-red-500" : "border-zinc-200"
                  }`}
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors flex items-center justify-center cursor-pointer"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.82l2.92 2.92c1.51-1.44 2.63-3.26 3.19-5.24-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zm2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.47-1.3c-.22 0-.44.03-.65.08L13.1 10.3c.05-.21.08-.43.08-.65 0-1.66-1.34-3-3-3z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                    </svg>
                  )}
                </button>
              </div>
              <FieldError field="password" />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm password"
                className={`text-sm w-full py-2 px-3 border-2 bg-zinc-50 text-zinc-900 placeholder-zinc-400 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32] ${
                  errors.confirmPassword ? "border-red-500" : "border-zinc-200"
                }`}
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <FieldError field="confirmPassword" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#E61E32] hover:bg-[#c91527] text-white font-semibold py-2.5 px-4 transition-colors duration-200 mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            {isPending ? "Registering team..." : "Register & Sign Up"}
          </button>

          <div className="text-center text-zinc-600 text-sm mt-4">
            Already have a team account?{" "}
            <Link
              href={`/team/login?hackathonId=${hackathon.id}`}
              className="text-[#E61E32] hover:text-[#c91527] font-semibold underline underline-offset-2 ml-1"
            >
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
