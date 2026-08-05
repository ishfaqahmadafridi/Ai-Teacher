'use client';

import { AuthField } from './AuthField';

interface UsernameFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export function UsernameField({ value, onChange, error }: UsernameFieldProps) {
  return (
    <AuthField
      id="username"
      name="username"
      label="Username (Optional)"
      placeholder="@lumina_user"
      value={value}
      onChange={onChange}
      autoComplete="username"
      error={error}
    />
  );
}
