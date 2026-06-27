"use client";
 
import { useState, useActionState, startTransition } from "react";
import Link from "next/link";
import { signInAction } from "../actions/auth-actions";
 
export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  const [state, formAction, isPending] = useActionState(signInAction, null);
 
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
 
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 text-zinc-900">
      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white border border-zinc-200 shadow-sm">
        
        {/* Left Branding Panel (Solid Light Grey, flat design) */}
        <div className="bg-zinc-100 text-zinc-900 p-8 md:p-12 md:w-1/2 flex flex-col justify-between min-h-[350px] border-b md:border-b-0 md:border-r border-zinc-200">
          <div>
            <span className="text-xs uppercase tracking-widest text-zinc-500 font-semibold border-b border-zinc-300 pb-2 inline-block">
              HackOS Platform
            </span>
          </div>

          <div className="mt-auto">
            <h1 className="text-2xl md:text-3xl font-medium leading-tight tracking-tight text-zinc-900">
              Welcome back to <span className="text-[#E61E32]">HackOS</span>.
            </h1>
            <p className="text-sm text-zinc-600 mt-2 max-w-xs">
              Sign in to manage your active hackathon <span className="text-[#E61E32] font-semibold">dashboards</span>.
            </p>
          </div>
        </div>
 
        {/* Right Form Panel (White) */}
        <div className="p-8 md:p-12 md:w-1/2 flex flex-col bg-white text-zinc-900 justify-center">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-6 font-medium">
            <Link href="/" className="hover:text-zinc-800 transition-colors">
              Home
            </Link>
            <span className="text-zinc-400">/</span>
            <span className="text-zinc-800">
              Sign In
            </span>
          </div>

          <div className="flex flex-col items-start mb-8">
            <h2 className="text-3xl font-medium mb-2 tracking-tight text-zinc-900">
              Sign In
            </h2>
            <p className="text-left text-zinc-500 text-sm">
              Welcome back to HackOS — Let&apos;s get organizing
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
                Work Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="organiser@hackos.io"
                className={`text-sm w-full py-2.5 px-3 border-2 bg-zinc-50 text-zinc-900 placeholder-zinc-400 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32] ${
                  emailError ? "border-red-500" : "border-zinc-200"
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!emailError}
                aria-describedby="email-error"
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
                  Account Password
                </label>
                <Link href="/forgot-password" className="text-xs text-zinc-500 hover:text-zinc-800 underline underline-offset-2">
                  Forgot password?
                </Link>
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
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors flex items-center justify-center"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5 select-none" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.82l2.92 2.92c1.51-1.44 2.63-3.26 3.19-5.24-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13(11.35 7 12 7zm2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.47-1.3c-.22 0-.44.03-.65.08L13.1 10.3c.05-.21.08-.43.08-.65 0-1.66-1.34-3-3-3z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 select-none" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                    </svg>
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="mt-1.5 text-xs text-red-600">{passwordError}</p>
              )}
            </div>
 
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#E61E32] hover:bg-[#c91527] text-white font-semibold py-2.5 px-4 transition-colors duration-200 mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPending ? "Signing in..." : "Sign In to HackOS"}
            </button>
 
            <div className="text-center text-zinc-600 text-sm mt-4">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="text-[#E61E32] hover:text-[#c91527] font-semibold underline underline-offset-2 ml-1">
                Register as organiser
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
