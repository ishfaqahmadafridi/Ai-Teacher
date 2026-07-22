'use client';

import { AuthField } from './AuthField';
import type { RegisterFormData } from '../../types';

interface IdentityRowProps {
  form: Pick<RegisterFormData, 'firstName' | 'lastName'>;
  fieldErrors: Partial<Record<keyof RegisterFormData, string>>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function IdentityRow({ form, fieldErrors, onChange }: IdentityRowProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <AuthField
          id="firstName"
          name="firstName"
          label="First Name"
          placeholder="Enter first name"
          value={form.firstName}
          onChange={onChange}
          required
          autoComplete="given-name"
        />
        {fieldErrors.firstName && (
          <p className="mt-1 text-xs text-[#ffb4ab] pl-1">{fieldErrors.firstName}</p>
        )}
      </div>
      <div>
        <AuthField
          id="lastName"
          name="lastName"
          label="Last Name"
          placeholder="Enter last name"
          value={form.lastName}
          onChange={onChange}
          required
          autoComplete="family-name"
        />
        {fieldErrors.lastName && (
          <p className="mt-1 text-xs text-[#ffb4ab] pl-1">{fieldErrors.lastName}</p>
        )}
      </div>
    </div>
  );
}
