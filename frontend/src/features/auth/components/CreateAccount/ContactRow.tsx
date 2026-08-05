'use client';

import { UsernameField } from './UsernameField';
import { MobileField } from './MobileField';
import type { RegisterFormData } from '../../types';

interface ContactRowProps {
  form: Pick<RegisterFormData, 'username' | 'mobile'>;
  fieldErrors?: Partial<Record<keyof RegisterFormData, string>>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ContactRow({ form, fieldErrors, onChange }: ContactRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <UsernameField
        value={form.username}
        onChange={onChange}
        error={fieldErrors?.username}
      />
      <MobileField
        value={form.mobile}
        onChange={onChange}
        error={fieldErrors?.mobile}
      />
    </div>
  );
}


