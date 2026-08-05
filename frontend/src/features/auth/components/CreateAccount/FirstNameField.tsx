'use client';

import { AuthField } from './AuthField';

interface FirstNameFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
}

export function FirstNameField({ value, onChange, error, required = true }: FirstNameFieldProps) {
  return (
    <AuthField
      id="firstName"
      name="firstName"
      label="First Name"
      placeholder="Enter first name"
      value={value}
      onChange={onChange}
      required={required}
      autoComplete="given-name"
      error={error}
    />
  );
}
