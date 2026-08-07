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
      className="rounded-xl px-3 py-3 text-white text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[#2563eb] cursor-pointer shrink-0"
      style={{
        background: '#1a2235',
        border: error ? '1.5px solid #EF4444' : '1px solid rgba(255,255,255,0.18)',
        colorScheme: 'dark',
      }}
    >
      {COUNTRY_CODES.map((item: CountryCodeOption) => (
        <option key={item.code} value={item.dialCode} className="bg-[#1a2235] text-white py-1">
          {item.flag} {item.dialCode} ({item.code})
        </option>
      ))}
    </select>
  );
});

CountryCodeSelect.displayName = 'CountryCodeSelect';
