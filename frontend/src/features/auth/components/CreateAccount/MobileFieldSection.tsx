'use client';

import { memo } from 'react';
import { CountryCodeSelect } from './CountryCodeSelect';
import type { MobileFieldSectionProps } from '../../types';

export const MobileFieldSection = memo(function MobileFieldSection({
  countryCode,
  mobile,
  onCountryCodeChange,
  onMobileChange,
  mobileError,
}: MobileFieldSectionProps) {
  return (
    <div>
      <label htmlFor="mobile" className="block text-xs font-semibold uppercase tracking-widest text-[#94a3b8] mb-2">
        Mobile Number <span className="text-red-400">*</span>
      </label>
      <div className="flex gap-2">
        <CountryCodeSelect
          id="countryCode"
          name="countryCode"
          value={countryCode}
          onChange={onCountryCodeChange}
          error={mobileError}
        />
        <input
          id="mobile"
          name="mobile"
          type="tel"
          autoComplete="tel"
          value={mobile}
          onChange={onMobileChange}
          placeholder="300 1234567"
          className="w-full rounded-xl px-4 py-3 text-white text-sm placeholder-[#64748b] outline-none transition-all duration-200 focus:ring-2 focus:ring-[#2563eb]"
          style={{
            background: '#1a2235',
            border: mobileError ? '1.5px solid #EF4444' : '1px solid rgba(255,255,255,0.18)',
          }}
        />
      </div>
      {mobileError && <p className="text-xs text-red-400 mt-1">{mobileError}</p>}
    </div>
  );
});

MobileFieldSection.displayName = 'MobileFieldSection';
