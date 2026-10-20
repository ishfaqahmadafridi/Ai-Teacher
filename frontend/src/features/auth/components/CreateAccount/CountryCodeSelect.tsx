'use client';

import { memo } from 'react';
import { COUNTRY_CODES } from '../../constants';
import type { CountryCodeOption } from '../../types';

export interface CountryCodeSelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  id?: string;
  name?: string;
  error?: string;
}

export const CountryCodeSelect = memo(function CountryCodeSelect({
  value,
  onChange,
  id = 'countryCode',
  name = 'countryCode',
  error,
}: CountryCodeSelectProps) {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className="rounded-xl px-3 py-3 text-dashboard-text text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[#2563eb] cursor-pointer shrink-0 max-w-[8rem]"
      style={{
        background: 'var(--color-dashboard-panel)',
        border: error ? '1.5px solid var(--color-dashboard-danger)' : '1px solid var(--color-dashboard-border)',
        colorScheme: 'light',
      }}
    >
      {COUNTRY_CODES.map((item: CountryCodeOption) => (
        <option key={item.code} value={item.dialCode} className="bg-dashboard-panel text-dashboard-text py-1">
          {item.flag} {item.dialCode} ({item.code})
        </option>
      ))}
    </select>
  );
});

CountryCodeSelect.displayName = 'CountryCodeSelect';
