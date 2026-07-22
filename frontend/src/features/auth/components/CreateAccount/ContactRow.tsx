'use client';

import { AuthField } from './AuthField';
import type { RegisterFormData } from '../../types';

interface ContactRowProps {
  form: Pick<RegisterFormData, 'username' | 'mobile'>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ContactRow({ form, onChange }: ContactRowProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <AuthField
        id="username"
        name="username"
        label="Username (Optional)"
        placeholder="@lumina_user"
        value={form.username}
        onChange={onChange}
        autoComplete="username"
      />
      <AuthField
        id="mobile"
        name="mobile"
        label="Mobile Number (Optional)"
        placeholder="+1 (555) 000-0000"
        type="tel"
        value={form.mobile}
        onChange={onChange}
        autoComplete="tel"
      />
    </div>
  );
}
