'use client';

import { PasswordField } from './PasswordField';
import type { RegisterFormData } from '../../types';

interface PasswordRowProps {
  form: Pick<RegisterFormData, 'password' | 'confirmPassword'>;
  fieldErrors: Partial<Record<keyof RegisterFormData, string>>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PasswordRow({ form, fieldErrors, onChange }: PasswordRowProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <PasswordField
          id="password"
          name="password"
          label="Password"
          placeholder="••••••••"
          value={form.password}
          onChange={onChange}
          required
          autoComplete="new-password"
        />
        {fieldErrors.password && (
          <p className="mt-1 text-xs text-[#ffb4ab] pl-1">{fieldErrors.password}</p>
        )}
      </div>
      <div>
        <PasswordField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          placeholder="••••••••"
          value={form.confirmPassword}
          onChange={onChange}
          required
          autoComplete="new-password"
        />
        {fieldErrors.confirmPassword && (
          <p className="mt-1 text-xs text-[#ffb4ab] pl-1">{fieldErrors.confirmPassword}</p>
        )}
      </div>
    </div>
  );
}
