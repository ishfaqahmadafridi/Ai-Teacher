'use client';

import { EmailField } from './EmailField';

interface EmailFieldSectionProps {
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function EmailFieldSection({ value, error, onChange }: EmailFieldSectionProps) {
  return (
    <EmailField
      value={value}
      error={error}
      onChange={onChange}
    />
  );
}

