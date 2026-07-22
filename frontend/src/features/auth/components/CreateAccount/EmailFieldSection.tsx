'use client';

import { AuthField } from './AuthField';
import type { RegisterFormData } from '../../types';

interface EmailFieldSectionProps {
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function EmailFieldSection({ value, error, onChange }: EmailFieldSectionProps) {
  return (
    <div>
      <AuthField
        id="email"
        name="email"
        label="Email Address"
        placeholder="name@example.com"
        type="email"
        value={value}
        onChange={onChange}
        required
        autoComplete="email"
      />
      {error && <p className="mt-1 text-xs text-[#ffb4ab] pl-1">{error}</p>}
    </div>
  );
}
