'use client';

import { memo } from 'react';
import { SocialAuthSection } from '../CreateAccount/SocialAuthSection';
import type { LoginSocialAuthSectionProps } from '../../types';

export const LoginSocialAuthSection = memo(function LoginSocialAuthSection({
  dividerText = 'Or sign in with',
  onGoogleClick,
  onMicrosoftClick,
  onAppleClick,
}: LoginSocialAuthSectionProps) {
  return (
    <SocialAuthSection
      showDivider={true}
      dividerText={dividerText}
      onGoogleClick={onGoogleClick}
      onMicrosoftClick={onMicrosoftClick}
      onAppleClick={onAppleClick}
    />
  );
});

LoginSocialAuthSection.displayName = 'LoginSocialAuthSection';
