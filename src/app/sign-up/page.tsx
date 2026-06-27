"use client";

import { useState, useActionState, startTransition } from "react";
import Link from "next/link";
import { signUpAction } from "../actions/auth-actions";

export default function SignUpPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    organizationName: "",
    phone: "",
    designation: "",
    website: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [state, formAction, isPending] = useActionState(signUpAction, null);

  const validateStep = (currentStep: number) => {
    const e: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.fullName.trim()) e.fullName = "Full name is required";
      if (!formData.email) e.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Enter a valid email";
      if (!formData.designation.trim()) e.designation = "Designation is required";
    } else if (currentStep === 2) {
      if (!formData.organizationName.trim()) e.organizationName = "Organisation name is required";
    } else if (currentStep === 3) {
      if (!formData.password) e.password = "Password is required";
      else if (formData.password.length < 8) e.password = "Must be at least 8 characters";
      if (!formData.confirmPassword) e.confirmPassword = "Please confirm your password";
      else if (formData.password !== formData.confirmPassword) e.confirmPassword = "Passwords do not match";
      if (!formData.agreeTerms) e.agreeTerms = "You must accept the terms";
    }
    return e;
  };

  const handleNext = () => {
    const stepErrors = validateStep(step);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setErrors({});
    setStep((prev) => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stepErrors = validateStep(3);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});

    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("email", formData.email);
    data.append("organizationName", formData.organizationName);
    data.append("phone", formData.phone);
    data.append("designation", formData.designation);
    data.append("website", formData.website);
    data.append("password", formData.password);

    startTransition(() => {
      formAction(data);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const FieldError = ({ field }: { field: string }) =>
    errors[field] ? <p className="mt-1.5 text-xs text-red-600">{errors[field]}</p> : null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 text-zinc-900">
      <div className="w-full relative max-w-6xl flex flex-col md:flex-row bg-white border border-zinc-200 shadow-sm min-h-[500px]">
        
        {/* Left Branding Panel (Solid Light Grey, flat design) */}
        <div className="bg-zinc-100 text-zinc-900 p-8 md:p-12 md:w-5/12 flex flex-col justify-between min-h-[350px] border-b md:border-b-0 md:border-r border-zinc-200">
          <div>
            <span className="text-xs uppercase tracking-widest text-zinc-500 font-semibold border-b border-zinc-300 pb-2 inline-block">
              HackOS Platform
            </span>
          </div>

          <div className="mt-auto">
            <h1 className="text-2xl md:text-3xl font-medium leading-tight tracking-tight text-zinc-900">
              Create your <span className="text-[#E61E32]">HackOS</span> profile.
            </h1>
            <p className="text-sm text-zinc-600 mt-2 max-w-xs">
              Get started and host your first <span className="text-[#E61E32] font-semibold">hackathon</span>.
            </p>
          </div>
        </div>
 
        {/* Right Form Panel (White) */}
        <div className="p-8 md:p-12 md:w-7/12 flex flex-col bg-white text-zinc-900 justify-center">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-6 font-medium">
            <Link href="/" className="hover:text-zinc-800 transition-colors">
              Home
            </Link>
            <span className="text-zinc-400">/</span>
            <span className="text-zinc-800">
              Sign Up
            </span>
          </div>

          {/* Step Indicator Headers */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step === s
                      ? "bg-[#E61E32] text-white"
                      : step > s
                      ? "bg-zinc-800 text-white"
                      : "bg-zinc-200 text-zinc-600"
                  }`}
                >
                  {s}
                </div>
                {s < 3 && <div className="w-8 h-[2px] bg-zinc-200" />}
              </div>
            ))}
          </div>

          <div className="flex flex-col items-start mb-6">
            <h2 className="text-3xl font-medium mb-1 tracking-tight text-zinc-900">
              {step === 1 && "Personal Info"}
              {step === 2 && "Organisation Info"}
              {step === 3 && "Security Settings"}
            </h2>
            <p className="text-left text-zinc-500 text-sm">
              Step {step} of 3 — Set up your organiser profile
            </p>
          </div>

          {state?.error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 border-l-4 border-red-500 mb-6 font-medium">
              {state.error}
            </div>
          )}
 
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            
            {/* ── STEP 1: Personal Info ── */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="signup-fullname" className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">
                    Full Name <span className="text-[#E61E32]">*</span>
                  </label>
                  <input
                    id="signup-fullname"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Jane Smith"
                    className={`text-sm w-full py-2.5 px-3 border-2 bg-zinc-50 text-zinc-900 placeholder-zinc-400 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32] ${
                      errors.fullName ? "border-red-500" : "border-zinc-200"
                    }`}
                  />
                  <FieldError field="fullName" />
                </div>

                <div>
                  <label htmlFor="signup-email" className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">
                    Work Email <span className="text-[#E61E32]">*</span>
                  </label>
                  <input
                    id="signup-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="organiser@hackos.io"
                    className={`text-sm w-full py-2.5 px-3 border-2 bg-zinc-50 text-zinc-900 placeholder-zinc-400 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32] ${
                      errors.email ? "border-red-500" : "border-zinc-200"
                    }`}
                  />
                  <FieldError field="email" />
                </div>

                <div>
                  <label htmlFor="signup-designation" className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">
                    Designation / Role <span className="text-[#E61E32]">*</span>
                  </label>
                  <input
                    id="signup-designation"
                    name="designation"
                    type="text"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="e.g. Event Lead, CTO, Dean"
                    className={`text-sm w-full py-2.5 px-3 border-2 bg-zinc-50 text-zinc-900 placeholder-zinc-400 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32] ${
                      errors.designation ? "border-red-500" : "border-zinc-200"
                    }`}
                  />
                  <FieldError field="designation" />
                </div>

                <div>
                  <label htmlFor="signup-phone" className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">
                    Phone Number <span className="text-zinc-400 font-normal normal-case">(optional)</span>
                  </label>
                  <input
                    id="signup-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="text-sm w-full py-2.5 px-3 border-2 bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32]"
                  />
                </div>
              </div>
            )}

            {/* ── STEP 2: Organisation Info ── */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="signup-orgname" className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">
                    Organisation / College Name <span className="text-[#E61E32]">*</span>
                  </label>
                  <input
                    id="signup-orgname"
                    name="organizationName"
                    type="text"
                    value={formData.organizationName}
                    onChange={handleChange}
                    placeholder="Acme Corp / MIT / IEEE"
                    className={`text-sm w-full py-2.5 px-3 border-2 bg-zinc-50 text-zinc-900 placeholder-zinc-400 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32] ${
                      errors.organizationName ? "border-red-500" : "border-zinc-200"
                    }`}
                  />
                  <FieldError field="organizationName" />
                </div>

                <div>
                  <label htmlFor="signup-website" className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">
                    Organisation Website <span className="text-zinc-400 font-normal normal-case">(optional)</span>
                  </label>
                  <input
                    id="signup-website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://yourorg.com"
                    className="text-sm w-full py-2.5 px-3 border-2 bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32]"
                  />
                </div>
              </div>
            )}

            {/* ── STEP 3: Security Settings ── */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="signup-password" className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">
                    Password <span className="text-[#E61E32]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="signup-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min. 8 characters"
                      className={`text-sm w-full py-2.5 px-3 pr-11 border-2 bg-zinc-50 text-zinc-900 placeholder-zinc-400 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32] ${
                        errors.password ? "border-red-500" : "border-zinc-200"
                      }`}
                    />
                    <button
                      type="button"
                      id="toggle-signup-password"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors flex items-center justify-center"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5 select-none" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.82l2.92 2.92c1.51-1.44 2.63-3.26 3.19-5.24-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.47-1.3c-.22 0-.44.03-.65.08L13.1 10.3c.05-.21.08-.43.08-.65 0-1.66-1.34-3-3-3z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 select-none" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <FieldError field="password" />
                </div>

                <div>
                  <label htmlFor="signup-confirm-password" className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">
                    Confirm Password <span className="text-[#E61E32]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="signup-confirm-password"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      className={`text-sm w-full py-2.5 px-3 pr-11 border-2 bg-zinc-50 text-zinc-900 placeholder-zinc-400 outline-none focus:ring-1 focus:ring-[#E61E32] focus:border-[#E61E32] ${
                        errors.confirmPassword ? "border-red-500" : "border-zinc-200"
                      }`}
                    />
                    <button
                      type="button"
                      id="toggle-confirm-password"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors flex items-center justify-center"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? (
                        <svg className="w-5 h-5 select-none" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.82l2.92 2.92c1.51-1.44 2.63-3.26 3.19-5.24-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.47-1.3c-.22 0-.44.03-.65.08L13.1 10.3c.05-.21.08-.43.08-.65 0-1.66-1.34-3-3-3z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 select-none" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <FieldError field="confirmPassword" />
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <div className="relative mt-0.5 shrink-0">
                      <input
                        id="signup-agree-terms"
                        name="agreeTerms"
                        type="checkbox"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div
                        className={`w-4 h-4 border-2 flex items-center justify-center transition-colors ${
                          formData.agreeTerms ? "bg-zinc-900 border-zinc-900" : errors.agreeTerms ? "border-red-500" : "border-zinc-300"
                        }`}
                      >
                        {formData.agreeTerms && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-zinc-500 leading-snug">
                      I agree to the{" "}
                      <Link href="/terms" className="text-zinc-900 font-medium underline underline-offset-2">Terms of Service</Link>
                      {" "}and{" "}
                      <Link href="/privacy" className="text-zinc-900 font-medium underline underline-offset-2">Privacy Policy</Link>
                    </span>
                  </label>
                  <FieldError field="agreeTerms" />
                </div>
              </div>
            )}

            {/* Step Navigation Controls */}
            <div className="flex gap-4 pt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 py-2.5 border-2 border-zinc-300 hover:border-zinc-400 bg-white text-zinc-800 text-sm font-semibold transition-colors duration-200"
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 bg-[#E61E32] hover:bg-[#c91527] text-white font-semibold py-2.5 px-4 transition-colors duration-200"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 bg-[#E61E32] hover:bg-[#c91527] text-white font-semibold py-2.5 px-4 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                >
                  {isPending ? "Creating account..." : "Complete Setup"}
                </button>
              )}
            </div>
          </form>

          <p className="text-center text-zinc-600 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/sign-in" id="goto-signin-link" className="text-[#E61E32] hover:text-[#c91527] font-semibold underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
