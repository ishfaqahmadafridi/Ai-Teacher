'use client';

import { memo } from 'react';
import Link from 'next/link';
import type { AuthConsentSectionProps } from '../../types';

export const AuthConsentSection = memo(function AuthConsentSection({
  agreeToTerms,
  agreeToPrivacy,
  termsError,
  privacyError,
  onConsentChange,
}: AuthConsentSectionProps) {
  return (
    <div className="space-y-3 pt-1">
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          name="agreeToTerms"
          checked={agreeToTerms}
          onChange={(e) => onConsentChange('agreeToTerms', e.target.checked)}
          className="w-4 h-4 mt-0.5 rounded accent-[#2563eb] shrink-0"
        />
        <span className="text-[#94a3b8] text-xs leading-relaxed">
          I agree to the{' '}
          <Link href="/terms" className="text-[#38bdf8] hover:underline">Terms of Service</Link>{' '}
          <span className="text-red-400">*</span>
        </span>
      </label>
      {termsError && <p className="text-xs text-red-400 pl-7">{termsError}</p>}

      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          name="agreeToPrivacy"
          checked={agreeToPrivacy}
          onChange={(e) => onConsentChange('agreeToPrivacy', e.target.checked)}
          className="w-4 h-4 mt-0.5 rounded accent-[#2563eb] shrink-0"
        />
        <span className="text-[#94a3b8] text-xs leading-relaxed">
          I agree to the{' '}
          <Link href="/privacy" className="text-[#38bdf8] hover:underline">Privacy Policy</Link>{' '}
          <span className="text-red-400">*</span>
        </span>
      </label>
      {privacyError && <p className="text-xs text-red-400 pl-7">{privacyError}</p>}
    </div>
  );
});

AuthConsentSection.displayName = 'AuthConsentSection';
