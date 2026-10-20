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
      <label htmlFor="mobile" className="block text-sm font-medium text-dashboard-muted mb-2">
        Mobile Number <span className="text-dashboard-danger">*</span>
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
          className="w-full rounded-xl px-4 py-3 text-dashboard-text text-sm placeholder:text-dashboard-muted outline-none transition-all duration-200 focus:ring-2 focus:ring-[#2563eb]"
          style={{
            background: 'var(--color-dashboard-panel)',
            border: mobileError ? '1.5px solid var(--color-dashboard-danger)' : '1px solid var(--color-dashboard-border)',
          }}
        />
      </div>
      {mobileError && <p className="text-xs text-dashboard-danger mt-1">{mobileError}</p>}
    </div>
  );
});

MobileFieldSection.displayName = 'MobileFieldSection';
