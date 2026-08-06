'use client';

import type { LoginPasswordFieldProps } from '../../types';
import { LoginPasswordInput } from './LoginPasswordInput';

export function LoginPasswordField({
  value,
  onChange,
  showPassword,
  onTogglePassword,
  error,
}: LoginPasswordFieldProps) {
  return (
    <div>
      <label
        htmlFor="login-password"
        className="block text-xs font-semibold uppercase tracking-wider text-[#c4c5d9] mb-2 font-['Geist',sans-serif]"
      >
        Password
      </label>
      <LoginPasswordInput
        value={value}
        onChange={onChange}
        showPassword={showPassword}
        onTogglePassword={onTogglePassword}
        error={error}
      />
      {error && <p className="text-xs text-[#ffb4ab] mt-1 pl-1">{error}</p>}
    </div>
  );
}
