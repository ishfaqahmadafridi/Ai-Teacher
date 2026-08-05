'use client';

import { SocialAuth } from '../CreateAccount/SocialAuth';
import type { LoginSocialAuthSectionProps } from '../../types';

export function LoginSocialAuthSection({
  dividerText = 'Or sign in with',
  onGoogleClick,
  onMicrosoftClick,
  onAppleClick,
}: LoginSocialAuthSectionProps) {
  return (
    <div className="mt-8 pt-8 border-t border-[#434656]/30 relative">
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#10131a] px-3 text-xs font-['Geist',sans-serif] text-[#c4c5d9] uppercase tracking-wider">
        {dividerText}
      </div>
      <SocialAuth
        onGoogleClick={onGoogleClick}
        onMicrosoftClick={onMicrosoftClick}
        onAppleClick={onAppleClick}
      />
    </div>
  );
}
