'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    // TODO: hook up to backend auth API
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);
    router.push('/classroom');
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{ background: '#0d141d', fontFamily: 'var(--font-outfit), var(--font-inter), sans-serif' }}
    >
      {/* ── Ambient background orbs ── */}
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

      {/* ── Card ── */}
      <div
        className="relative w-full max-w-md mx-4 rounded-2xl p-8 md:p-10"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(99,179,237,0.12)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 60px rgba(59,130,246,0.06)',
          animation: 'intro-fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both',
        }}
      >
        {/* Brand */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="relative" style={{ width: 60, height: 60 }}>
            <Image
              src="/neurolearn-logo.png"
              alt="NeuroLearn"
              fill
              sizes="60px"
              className="object-contain"
              style={{ filter: 'drop-shadow(0 0 10px rgba(79,195,247,0.75))' }}
            />
          </div>
          <span
            className="font-extrabold tracking-[0.14em] uppercase text-white"
            style={{ fontSize: '1.05rem' }}
          >
            NEUROLEARN
          </span>
        </div>

        <h1 className="text-2xl font-bold text-center text-white mb-1">
          Create your account
        </h1>
        <p className="text-center text-blue-200/50 text-sm mb-8">
          Start your AI learning journey today
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-2.5 rounded-lg text-sm text-red-300 bg-red-500/10 border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-blue-200/60 uppercase tracking-widest">
              Full Name
            </label>
            <input
              id="register-fullname"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              value={form.fullName}
              onChange={handleChange}
              placeholder="Jane Doe"
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-blue-200/30 outline-none transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(99,179,237,0.18)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'rgba(99,179,237,0.55)')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(99,179,237,0.18)')}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-blue-200/60 uppercase tracking-widest">
              Email
            </label>
            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="jane@example.com"
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-blue-200/30 outline-none transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(99,179,237,0.18)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'rgba(99,179,237,0.55)')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(99,179,237,0.18)')}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-blue-200/60 uppercase tracking-widest">
              Password
            </label>
            <div className="relative">
              <input
                id="register-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                minLength={8}
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 8 characters"
                className="w-full px-4 py-3 pr-11 rounded-xl text-sm text-white placeholder-blue-200/30 outline-none transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(99,179,237,0.18)',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(99,179,237,0.55)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(99,179,237,0.18)')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300/50 hover:text-blue-200 transition-colors bg-transparent border-none cursor-pointer p-0"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-blue-200/60 uppercase tracking-widest">
              Confirm Password
            </label>
            <input
              id="register-confirm-password"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-blue-200/30 outline-none transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(99,179,237,0.18)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'rgba(99,179,237,0.55)')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(99,179,237,0.18)')}
            />
          </div>

          {/* Submit */}
          <button
            id="register-submit-btn"
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-300 relative overflow-hidden"
            style={{
              background: isLoading
                ? 'rgba(59,130,246,0.4)'
                : 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
              boxShadow: isLoading ? 'none' : '0 0 24px rgba(99,102,241,0.4)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                  <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating account…
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-blue-200/10" />
          <span className="text-xs text-blue-200/30">or</span>
          <div className="flex-1 h-px bg-blue-200/10" />
        </div>

        <p className="text-center text-blue-200/40 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
            Sign in
          </Link>
        </p>

        <p className="text-center text-blue-200/25 text-xs mt-4">
          By registering you agree to our{' '}
          <span className="text-blue-400/60">Terms</span> &amp;{' '}
          <span className="text-blue-400/60">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
