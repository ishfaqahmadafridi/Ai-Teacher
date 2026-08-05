'use client';

import { AuthField } from './AuthField';

interface MobileFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export function MobileField({ value, onChange, error }: MobileFieldProps) {
  return (
    <AuthField
      id="mobile"
      name="mobile"
      label="Mobile Number (Optional)"
      placeholder="+1 (555) 000-0000"
      type="tel"
      value={value}
      onChange={onChange}
      autoComplete="tel"
      error={error}
    />
  );
}
