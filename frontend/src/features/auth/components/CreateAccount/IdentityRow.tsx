'use client';

import { FirstNameField } from './FirstNameField';
import { LastNameField } from './LastNameField';
import type { RegisterFormData } from '../../types';

interface IdentityRowProps {
  form: Pick<RegisterFormData, 'firstName' | 'lastName'>;
  fieldErrors: Partial<Record<keyof RegisterFormData, string>>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function IdentityRow({ form, fieldErrors, onChange }: IdentityRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FirstNameField
        value={form.firstName}
        onChange={onChange}
        error={fieldErrors.firstName}
      />
      <LastNameField
        value={form.lastName}
        onChange={onChange}
        error={fieldErrors.lastName}
      />
    </div>
  );
}


