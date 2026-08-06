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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <PasswordField
        id="password"
        name="password"
        label="Password"
        placeholder="••••••••"
        value={form.password}
        onChange={onChange}
        required
        autoComplete="new-password"
        error={fieldErrors.password}
      />
      <PasswordField
        id="confirmPassword"
        name="confirmPassword"
        label="Confirm Password"
        placeholder="••••••••"
        value={form.confirmPassword}
        onChange={onChange}
        required
        autoComplete="new-password"
        error={fieldErrors.confirmPassword}
      />
    </div>
  );
}


