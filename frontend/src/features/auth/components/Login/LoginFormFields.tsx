'use client';

import { memo } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { LoginFormFieldsProps } from '../../types';

export const LoginFormFields = memo(function LoginFormFields({
  form,
  showPassword,
  isLoading,
  error,
  onChange,
  onTogglePassword,
  onSubmit,
}: LoginFormFieldsProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/30 text-dashboard-danger text-sm px-4 py-3">
          {error}
        </div>
      )}

      {/* Email Field */}
      <div>
        <label htmlFor="login-email" className="block text-sm font-medium text-dashboard-muted mb-2">
          Email Address
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={onChange}
          placeholder="Enter your email"
          className="w-full rounded-xl px-4 py-3 text-dashboard-text text-sm placeholder:text-dashboard-muted outline-none transition-all duration-200 focus:ring-2 focus:ring-[#2563eb]"
          style={{ background: 'var(--color-dashboard-panel)', border: '1px solid var(--color-dashboard-border)' }}
        />
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="login-password" className="block text-sm font-medium text-dashboard-muted mb-2">
          Password
        </label>
        <div className="relative">
          <input
            id="login-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={form.password}
            onChange={onChange}
            placeholder="Enter your password"
            className="w-full rounded-xl px-4 py-3 pr-12 text-dashboard-text text-sm placeholder:text-dashboard-muted outline-none transition-all duration-200 focus:ring-2 focus:ring-[#2563eb]"
            style={{ background: 'var(--color-dashboard-panel)', border: '1px solid var(--color-dashboard-border)' }}
          />
          <button
            type="button"
            onClick={onTogglePassword}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-dashboard-muted hover:text-dashboard-muted transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sign In Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl py-3.5 text-white font-semibold text-sm transition-all duration-200 bg-dashboard-primary hover:bg-dashboard-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dashboard-primary disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Signing in...
          </>
        ) : (
          <>
            Sign In
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
});

LoginFormFields.displayName = 'LoginFormFields';
