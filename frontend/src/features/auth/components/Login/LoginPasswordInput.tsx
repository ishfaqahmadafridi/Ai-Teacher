'use client';

import type { LoginPasswordInputProps } from '../../types';

export function LoginPasswordInput({
  id = 'login-password',
  name = 'password',
  value,
  onChange,
  showPassword,
  onTogglePassword,
  error,
  placeholder = 'Enter your password',
  autoComplete = 'current-password',
  className = '',
}: LoginPasswordInputProps) {
  return (
    <div className={`relative ${className}`}>
      <input
        id={id}
        name={name}
        type={showPassword ? 'text' : 'password'}
        autoComplete={autoComplete}
        required
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-[#272a31] border ${
          error ? 'border-[#ffb4ab]' : 'border-[#434656]'
        } rounded-lg px-4 py-3 pr-10 text-[#e1e2eb] placeholder-[#8e90a2] focus:outline-none focus:border-[#2e5bff] focus:ring-1 focus:ring-[#2e5bff] transition-colors font-['Inter',sans-serif] text-base`}
      />
      <button
        type="button"
        onClick={onTogglePassword}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#c4c5d9] hover:text-[#e1e2eb] transition-colors bg-transparent border-none cursor-pointer"
        tabIndex={-1}
      >
        {showPassword ? (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
}
