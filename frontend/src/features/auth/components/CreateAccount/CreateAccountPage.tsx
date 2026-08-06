'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Brain, Eye, EyeOff } from 'lucide-react';
import { useRegister } from '../../hooks/useRegister';

export function CreateAccountPage() {
  const {
    form,
    fieldErrors,
    showPassword,
    isLoading,
    error,
    handleChange,
    handleConsentChange,
    handleSubmit,
    togglePassword,
  } = useRegister();

  const inputCls = "w-full rounded-xl px-4 py-3 text-white text-sm placeholder-[#64748b] outline-none transition-all duration-200 focus:ring-2 focus:ring-[#2563eb]";
  const inputStyle: React.CSSProperties = { background: '#1a2235', border: 'none' };
  const inputErrStyle = (hasErr: boolean): React.CSSProperties => ({
    background: '#1a2235',
    border: hasErr ? '1.5px solid #EF4444' : 'none',
  });

  return (
    <div
      className="min-h-screen w-full flex relative overflow-hidden"
      style={{ background: '#0d141d', fontFamily: 'var(--font-outfit), var(--font-inter), sans-serif' }}
    >
      {/* ── Left Form Panel ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 relative z-10 overflow-y-auto">
        {/* Ambient glow orbs */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-10%', left: '-5%',
            width: '55vw', height: '55vw',
            maxWidth: 700, maxHeight: 700,
            background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: '-15%', right: '-5%',
            width: '50vw', height: '50vw',
            maxWidth: 600, maxHeight: 600,
            background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        {/* Glass Card */}
        <div
          className="relative z-10 w-full max-w-[520px] rounded-3xl px-8 sm:px-12 py-10 shadow-2xl my-auto"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 64px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.06)',
          }}
        >
          {/* Brand Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1d4ed8] via-[#2563eb] to-[#38bdf8] flex items-center justify-center shadow-lg shadow-[#2563eb]/30 shrink-0">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-white tracking-[0.12em] uppercase">
              NEUROLEARN
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
            Create Account
          </h1>
          <p className="text-[#94a3b8] text-base mb-8">
            Begin your high-tech gateway to the future of learning.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3">
                {error}
              </div>
            )}

            {/* First Name / Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-xs font-semibold uppercase tracking-widest text-[#94a3b8] mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className={inputCls}
                  style={inputErrStyle(!!fieldErrors.firstName)}
                />
                {fieldErrors.firstName && <p className="text-xs text-red-400 mt-1">{fieldErrors.firstName}</p>}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-xs font-semibold uppercase tracking-widest text-[#94a3b8] mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className={inputCls}
                  style={inputErrStyle(!!fieldErrors.lastName)}
                />
                {fieldErrors.lastName && <p className="text-xs text-red-400 mt-1">{fieldErrors.lastName}</p>}
              </div>
            </div>

            {/* Username / Mobile */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="username" className="block text-xs font-semibold uppercase tracking-widest text-[#94a3b8] mb-2">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  className={inputCls}
                  style={inputStyle}
                />
              </div>
              <div>
                <label htmlFor="mobile" className="block text-xs font-semibold uppercase tracking-widest text-[#94a3b8] mb-2">
                  Mobile
                </label>
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  autoComplete="tel"
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="+1 234 567"
                  className={inputCls}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="block text-xs font-semibold uppercase tracking-widest text-[#94a3b8] mb-2">
                Email Address
              </label>
              <input
                id="reg-email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className={inputCls}
                style={inputErrStyle(!!fieldErrors.email)}
              />
              {fieldErrors.email && <p className="text-xs text-red-400 mt-1">{fieldErrors.email}</p>}
            </div>

            {/* Password / Confirm Password */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="reg-password" className="block text-xs font-semibold uppercase tracking-widest text-[#94a3b8] mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full rounded-xl px-4 py-3 pr-10 text-white text-sm placeholder-[#64748b] outline-none transition-all duration-200 focus:ring-2 focus:ring-[#2563eb]"
                    style={inputErrStyle(!!fieldErrors.password)}
                  />
                  <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#94a3b8] transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.password && <p className="text-xs text-red-400 mt-1">{fieldErrors.password}</p>}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-widest text-[#94a3b8] mb-2">
                  Confirm
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={inputCls}
                  style={inputErrStyle(!!fieldErrors.confirmPassword)}
                />
                {fieldErrors.confirmPassword && <p className="text-xs text-red-400 mt-1">{fieldErrors.confirmPassword}</p>}
              </div>
            </div>

            {/* Consent Checkboxes */}
            <div className="space-y-3 pt-1">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={form.agreeToTerms}
                  onChange={(e) => handleConsentChange('agreeToTerms', e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded accent-[#2563eb] shrink-0"
                />
                <span className="text-[#94a3b8] text-xs leading-relaxed">
                  I agree to the{' '}
                  <Link href="/terms" className="text-[#38bdf8] hover:underline">Terms of Service</Link>
                </span>
              </label>
              {fieldErrors.agreeToTerms && <p className="text-xs text-red-400 pl-7">{fieldErrors.agreeToTerms}</p>}

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="agreeToPrivacy"
                  checked={form.agreeToPrivacy}
                  onChange={(e) => handleConsentChange('agreeToPrivacy', e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded accent-[#2563eb] shrink-0"
                />
                <span className="text-[#94a3b8] text-xs leading-relaxed">
                  I agree to the{' '}
                  <Link href="/privacy" className="text-[#38bdf8] hover:underline">Privacy Policy</Link>
                </span>
              </label>
              {fieldErrors.agreeToPrivacy && <p className="text-xs text-red-400 pl-7">{fieldErrors.agreeToPrivacy}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl py-3.5 text-white font-bold text-sm uppercase tracking-widest transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              style={{
                background: isLoading
                  ? 'rgba(37,99,235,0.6)'
                  : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                boxShadow: isLoading ? 'none' : '0 4px 24px rgba(37,99,235,0.4)',
              }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>

            {/* Sign In Link */}
            <p className="text-center text-[#64748b] text-sm pt-2">
              Already have an account?{' '}
              <Link href="/login" className="text-[#38bdf8] hover:text-[#7dd3fc] font-semibold transition-colors">
                Sign In
              </Link>
            </p>

            {/* Divider */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 text-[#64748b]">Or sign up with</span>
              </div>
            </div>

            {/* Social Auth Buttons */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: 'Google',
                  icon: (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z" />
                      <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z" />
                      <path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z" />
                      <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z" />
                    </svg>
                  ),
                },
                {
                  label: 'Microsoft',
                  icon: (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#F35325" d="M11.4 11.4H0V0h11.4z" />
                      <path fill="#81BC06" d="M24 11.4H12.6V0H24z" />
                      <path fill="#05A6F0" d="M11.4 24H0V12.6h11.4z" />
                      <path fill="#FFBA08" d="M24 24H12.6V12.6H24z" />
                    </svg>
                  ),
                },
                {
                  label: 'Apple',
                  icon: (
                    <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                    </svg>
                  ),
                },
              ].map(({ label, icon }) => (
                <button
                  key={label}
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-xl py-3 text-white text-sm font-medium transition-all duration-200 hover:scale-105 cursor-pointer"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {icon}
                  <span className="hidden sm:inline text-xs">{label}</span>
                </button>
              ))}
            </div>
          </form>
        </div>
      </div>

      {/* ── Right Hero Panel ── */}
      <div className="hidden lg:block lg:w-1/2 relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[#0d141d]/30 z-10 pointer-events-none" />
        <Image
          src="/ai-mentor-bg.png"
          alt="AI Teacher interactive mentor learning scene"
          fill
          sizes="50vw"
          priority
          className="object-cover"
        />
        {/* Edge blend */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0d141d] via-[#0d141d]/70 to-transparent z-20 pointer-events-none" />
      </div>
    </div>
  );
}
