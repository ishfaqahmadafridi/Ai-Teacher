'use client';

import { LoginFormFields } from './LoginFormFields';
import { LoginFooter } from './LoginFooter';
import { LoginSocialAuthSection } from './LoginSocialAuthSection';

export function LoginForm() {
  return (
    <div className="w-full">
      <LoginFormFields />
      <LoginFooter />

      <LoginSocialAuthSection />
    </div>
  );
}
