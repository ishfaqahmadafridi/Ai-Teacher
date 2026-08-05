'use client';

import type { LoginEmailFieldProps } from '../../types';

export function LoginEmailField({ value, onChange, error }: LoginEmailFieldProps) {
  return (
    <div>
      <label
        htmlFor="login-email"
        className="block text-xs font-semibold uppercase tracking-wider text-[#c4c5d9] mb-2 font-['Geist',sans-serif]"
      >
        Email Address
      </label>
      <div className="relative">
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={value}
          onChange={onChange}
          placeholder="Enter your email"
          className="w-full bg-[#272a31] border border-[#434656] rounded-lg px-4 py-3 text-[#e1e2eb] placeholder-[#8e90a2] focus:outline-none focus:border-[#2e5bff] focus:ring-1 focus:ring-[#2e5bff] transition-colors font-['Inter',sans-serif] text-base"
          style={{
            borderColor: error ? '#ffb4ab' : undefined,
          }}
        />
      </div>
      {error && <p className="text-xs text-[#ffb4ab] mt-1 pl-1">{error}</p>}
    </div>
  );
}
