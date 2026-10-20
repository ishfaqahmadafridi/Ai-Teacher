'use client';

import { memo } from 'react';
import { AuthBrand } from '../AuthBrand';
import { AuthPageLayout } from '../AuthPageLayout';
import { useLoginPage } from '../../hooks/useLoginPage';
import { LoginHeader } from './LoginHeader';
import { LoginFormFields } from './LoginFormFields';
import { LoginSocialButtons } from './LoginSocialButtons';
import { LoginHeroPanel } from './LoginHeroPanel';

export const LoginPage = memo(function LoginPage() {
  const {
    form,
    showPassword,
    isLoading,
    error,
    handleChange,
    togglePassword,
    handleSubmit,
  } = useLoginPage();

  return (
    <AuthPageLayout>
      {/* Left Form Panel */}
      <div className="w-full min-w-0 flex items-center justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-12 xl:px-16">
        {/* Form content */}
        <div className="w-full max-w-[34rem]">
          <AuthBrand />
          <div className="rounded-2xl border border-dashboard-border bg-dashboard-panel p-5 sm:p-8">
          <LoginHeader />

          <LoginFormFields
            form={form}
            showPassword={showPassword}
            isLoading={isLoading}
            error={error}
            onChange={handleChange}
            onTogglePassword={togglePassword}
            onSubmit={handleSubmit}
          />

          <LoginSocialButtons />
          </div>
        </div>
      </div>

      {/* Right Hero Panel */}
      <LoginHeroPanel />
    </AuthPageLayout>
  );
});

LoginPage.displayName = 'LoginPage';
