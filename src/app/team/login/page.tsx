"use client";

import { useState, useActionState, startTransition, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { teamSignInAction } from "../../actions/team-auth-actions";

function LoginFormContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const searchParams = useSearchParams();
  const hackathonId = searchParams.get("hackathonId");

  const [state, formAction, isPending] = useActionState(teamSignInAction, null);

  const validateEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const validatePassword = (value: string) => {
    return value.length >= 6;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let valid = true;

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 6 characters.");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (valid) {
      const formData = new FormData(e.currentTarget);
      startTransition(() => {
        formAction(formData);
      });
    }
  };

  const signupLink = hackathonId 
    ? `/team/signup?hackathonId=${hackathonId}`
    : "/team/signup";

  return (
    <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white border border-zinc-200 shadow-sm">
      
      {/* Left Branding Panel */}
      <div 
        className="relative p-8 md:p-12 md:w-1/2 flex flex-col justify-between min-h-[350px] border-b md:border-b-0 md:border-r border-zinc-200 bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80")`
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
            Welcome back to <span className="text-[#E61E32]">HackOS</span>.
          </h1>
          <p className="text-xs text-zinc-200 mt-1 max-w-xs font-normal">
            Log in to manage your team dashboard and check your registration status.
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="p-8 md:p-12 md:w-1/2 flex flex-col bg-white text-zinc-900 justify-center">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-6 font-medium">
          <Link href="/" className="hover:text-zinc-800 transition-colors">
            Home
          </Link>
          <span className="text-zinc-400">/</span>
          <span className="text-zinc-800">
            Team Login
          </span>
        </div>

        <div className="flex flex-col items-start mb-8">
          <h2 className="text-3xl font-medium mb-2 tracking-tight text-zinc-900">
            Team Login
          </h2>
          <p className="text-left text-zinc-500 text-sm">
            Welcome back Team Lead — Manage your squad
          </p>
        </div>

        {state?.error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 border-l-4 border-red-500 mb-6 font-medium">
            {state.error}
          </div>
        )}

        <form
          className="flex flex-col gap-5"
          onSubmit={handleSubmit}
          noValidate
        >
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">
              Team Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="teamlead@hackos.io"
              className={`text-sm w-full py-2.5 px-3 border-2 bg-zinc-50 text-zinc-900 placeholder-zinc-400 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32] ${
                emailError ? "border-red-500" : "border-zinc-200"
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!emailError}
              aria-describedby="email-error"
              autoComplete="email"
            />
            {emailError && (
              <p id="email-error" className="text-red-600 text-xs mt-1.5">
                {emailError}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter password"
                className={`text-sm w-full py-2.5 px-3 pr-11 border-2 bg-zinc-50 text-zinc-900 placeholder-zinc-400 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32] ${
                  passwordError ? "border-red-500" : "border-zinc-200"
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!passwordError}
                aria-describedby="password-error"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors flex items-center justify-center cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="w-5 h-5 select-none" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.82l2.92 2.92c1.51-1.44 2.63-3.26 3.19-5.24-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zm2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.47-1.3c-.22 0-.44.03-.65.08L13.1 10.3c.05-.21.08-.43.08-.65 0-1.66-1.34-3-3-3z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 select-none" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                  </svg>
                )}
              </button>
            </div>
            {passwordError && (
              <p className="mt-1.5 text-xs text-red-600" id="password-error">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#E61E32] hover:bg-[#c91527] text-white font-semibold py-2.5 px-4 transition-colors duration-200 mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            {isPending ? "Logging in..." : "Log In as Team Lead"}
          </button>

          <div className="text-center text-zinc-600 text-sm mt-4">
            Don&apos;t have a team account?{" "}
            <Link href={signupLink} className="text-[#E61E32] hover:text-[#c91527] font-semibold underline underline-offset-2 ml-1">
              Register team
            </Link>
          </div>

          <div className="text-center text-zinc-400 text-xs mt-3 flex items-center justify-center gap-1.5 border-t border-zinc-100 pt-3">
            <span>Have an invite code?</span>
            <Link href="/team/join" className="text-[#E61E32] hover:text-[#c91527] font-bold hover:underline">
              Join existing team
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TeamLoginPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col justify-between font-sans">
      
      {/* 1. PUBLIC NAVBAR (Top Red Bar) */}
      <header className="w-full bg-[#E61E32] border-b border-[#c91527] px-6 py-4 flex items-center justify-between gap-4 shrink-0 shadow-sm">
        <Link href="/" className="font-semibold text-lg tracking-tight text-white hover:text-red-100 transition-colors">
          HackOS
        </Link>
        <div className="flex gap-4 items-center">
          <Link
            href="/active-hacks"
            className="text-xs font-semibold text-red-100 hover:text-white transition-colors"
          >
            Explore Hub
          </Link>
          <Link
            href="/sign-in"
            className="bg-white hover:bg-zinc-50 text-[#E61E32] border border-zinc-200 font-bold py-1.5 px-4 rounded text-xs transition-colors shadow-sm cursor-pointer"
          >
            Organizer Login
          </Link>
        </div>
      </header>

      {/* 2. FORM AREA */}
      <main className="flex-grow flex items-center justify-center p-6 md:p-12 w-full max-w-7xl mx-auto">
        <Suspense fallback={<div className="text-zinc-500 font-medium">Loading...</div>}>
          <LoginFormContent />
        </Suspense>
      </main>

      {/* 3. GREY FOOTER */}
      <footer className="border-t border-zinc-200 py-4 text-center text-xs text-zinc-600 font-semibold bg-zinc-100 w-full shrink-0 flex flex-col sm:flex-row items-center justify-center gap-2">
        <span>© 2026 HackOS Platform. All Rights Reserved.</span>
        <span className="hidden sm:inline text-zinc-300">|</span>
        <div className="flex items-center gap-1.5 font-normal text-zinc-650">
          <span>Powered by</span>
          <img 
            src="https://ik.imagekit.io/dypkhqxip/redlix%20new?updatedAt=1781042212493" 
            alt="Redlix Logo" 
            className="h-6.5 object-contain brightness-95 opacity-90 hover:opacity-100 hover:brightness-100 transition-all"
          />
        </div>
      </footer>

    </div>
  );
}
