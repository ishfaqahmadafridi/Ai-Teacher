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
        <span className="material-symbols-outlined text-xl">
          {showPassword ? 'visibility_off' : 'visibility'}
        </span>
      </button>
    </div>
  );
}
