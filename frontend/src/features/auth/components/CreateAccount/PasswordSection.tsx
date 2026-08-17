'use client';

import { memo } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { INPUT_BASE_CLASSES } from '../../constants';
import { getInputStyle } from '../../utilities';
import type { PasswordSectionProps } from '../../types';

export const PasswordSection = memo(function PasswordSection({
  password,
  confirmPassword,
  showPassword,
  passwordError,
  confirmPasswordError,
  onChange,
  onTogglePassword,
}: PasswordSectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label htmlFor="reg-password" className="block text-xs font-semibold uppercase tracking-widest text-[#94a3b8] mb-2">
          Password <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <input
            id="reg-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={password}
            onChange={onChange}
            placeholder="••••••••"
            className="w-full rounded-xl px-4 py-3 pr-10 text-white text-sm placeholder-[#64748b] outline-none transition-all duration-200 focus:ring-2 focus:ring-[#2563eb]"
            style={getInputStyle(passwordError)}
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#94a3b8] transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {passwordError && <p className="text-xs text-red-400 mt-1">{passwordError}</p>}
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-widest text-[#94a3b8] mb-2">
          Confirm Password <span className="text-red-400">*</span>
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={onChange}
          placeholder="••••••••"
          className={INPUT_BASE_CLASSES}
          style={getInputStyle(confirmPasswordError)}
        />
        {confirmPasswordError && <p className="text-xs text-red-400 mt-1">{confirmPasswordError}</p>}
      </div>
    </div>
  );
});

PasswordSection.displayName = 'PasswordSection';
