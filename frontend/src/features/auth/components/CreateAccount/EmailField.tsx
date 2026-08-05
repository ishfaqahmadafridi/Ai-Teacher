'use client';

import { AuthField } from './AuthField';

interface EmailFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
}

export function EmailField({ value, onChange, error, required = true }: EmailFieldProps) {
  return (
    <AuthField
      id="email"
      name="email"
      label="Email Address"
      placeholder="name@example.com"
      type="email"
      value={value}
      onChange={onChange}
      required={required}
      autoComplete="email"
      error={error}
    />
  );
}
