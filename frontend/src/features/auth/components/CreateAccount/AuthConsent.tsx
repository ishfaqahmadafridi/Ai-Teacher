'use client';

import Link from 'next/link';
import { Checkbox } from '../ui/Checkbox/Checkbox';
import { Label } from '../ui/Label/Label';
import type { AuthConsentProps } from '../../types';

export function AuthConsent({
  agreeToTerms,
  agreeToPrivacy,
  onTermsChange,
  onPrivacyChange,
}: AuthConsentProps) {
  return (
    <div className="space-y-4 pt-2">
      {/* Terms & Conditions */}
      <div className="flex items-start gap-3">
        <Checkbox
          id="agreeToTerms"
          checked={agreeToTerms}
          onCheckedChange={(checked) => onTermsChange(checked as boolean)}
          className="mt-0.5 border-white/20 bg-black/20 data-[state=checked]:bg-[#0043eb] data-[state=checked]:border-[#0043eb]"
        />
        <Label
          htmlFor="agreeToTerms"
          className="text-[14px] font-semibold leading-5 tracking-[0.05em] cursor-pointer"
          style={{ color: '#c6c6cc', fontFamily: 'Inter, sans-serif' }}
        >
          I agree to the{' '}
          <Link
            href="/terms"
            className="text-[#b8c3ff] hover:underline transition-colors"
          >
            Terms &amp; Conditions
          </Link>
        </Label>
      </div>

      {/* Privacy Policy */}
      <div className="flex items-start gap-3">
        <Checkbox
          id="agreeToPrivacy"
          checked={agreeToPrivacy}
          onCheckedChange={(checked) => onPrivacyChange(checked as boolean)}
          className="mt-0.5 border-white/20 bg-black/20 data-[state=checked]:bg-[#0043eb] data-[state=checked]:border-[#0043eb]"
        />
        <Label
          htmlFor="agreeToPrivacy"
          className="text-[14px] font-semibold leading-5 tracking-[0.05em] cursor-pointer"
          style={{ color: '#c6c6cc', fontFamily: 'Inter, sans-serif' }}
        >
          I agree to the{' '}
          <Link
            href="/privacy"
            className="text-[#b8c3ff] hover:underline transition-colors"
          >
            Privacy Policy
          </Link>
        </Label>
      </div>
    </div>
  );
}
