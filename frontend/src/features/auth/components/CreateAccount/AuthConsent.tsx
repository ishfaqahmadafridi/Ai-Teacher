'use client';

import { TermsConsentRow } from './TermsConsentRow';
import { PrivacyConsentRow } from './PrivacyConsentRow';
import type { AuthConsentProps } from '../../types';

export function AuthConsent({
  agreeToTerms,
  agreeToPrivacy,
  onTermsChange,
  onPrivacyChange,
  termsError,
  privacyError,
}: AuthConsentProps) {
  return (
    <div className="space-y-2.5 pt-1 font-['Inter',sans-serif]">
      <TermsConsentRow
        checked={agreeToTerms}
        onChange={onTermsChange}
        error={termsError}
      />
      <PrivacyConsentRow
        checked={agreeToPrivacy}
        onChange={onPrivacyChange}
        error={privacyError}
      />
    </div>
  );
}


