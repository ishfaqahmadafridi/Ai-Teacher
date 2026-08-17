'use client';

import { memo } from 'react';
import type { RegisterFormFieldsProps } from '../../types';

export const RegisterFormFields = memo(function RegisterFormFields({
  form,
  showPassword,
  isLoading,
  onChange,
  onTogglePassword,
  onSubmit,
}: RegisterFormFieldsProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
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
          onChange={onChange}
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
          onChange={onChange}
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
            onChange={onChange}
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
            onClick={onTogglePassword}
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
          onChange={onChange}
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

      {/* Submit Button */}
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
  );
});

RegisterFormFields.displayName = 'RegisterFormFields';
