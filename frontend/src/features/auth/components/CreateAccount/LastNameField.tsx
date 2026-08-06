'use client';

import { AuthField } from './AuthField';

interface LastNameFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
}

export function LastNameField({ value, onChange, error, required = true }: LastNameFieldProps) {
  return (
    <AuthField
      id="lastName"
      name="lastName"
      label="Last Name"
      placeholder="Enter last name"
      value={value}
      onChange={onChange}
      required={required}
      autoComplete="family-name"
      error={error}
    />
  );
}
