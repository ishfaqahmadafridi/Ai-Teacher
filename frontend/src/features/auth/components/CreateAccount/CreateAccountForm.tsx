'use client';

import { memo } from 'react';
import { IdentitySection } from './IdentitySection';
import { UsernameSection } from './UsernameSection';
import { MobileFieldSection } from './MobileFieldSection';
import { EmailSection } from './EmailSection';
import { PasswordSection } from './PasswordSection';
import { AuthConsentSection } from './AuthConsentSection';
import { FormSubmitButton } from './FormSubmitButton';
import { SocialAuthSection } from './SocialAuthSection';
import type { CreateAccountFormProps } from '../../types';

export const CreateAccountForm = memo(function CreateAccountForm({
  form,
  fieldErrors,
  showPassword,
  isLoading,
  error,
  handleChange,
  handleConsentChange,
  handleSubmit,
  togglePassword,
}: CreateAccountFormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3">
          {error}
        </div>
      )}

      {/* First Name & Last Name */}
      <IdentitySection
        firstName={form.firstName}
        lastName={form.lastName}
        firstNameError={fieldErrors.firstName}
        lastNameError={fieldErrors.lastName}
        onChange={handleChange}
      />

      {/* Username */}
      <UsernameSection
        username={form.username}
        usernameError={fieldErrors.username}
        onChange={handleChange}
      />

      {/* Mobile & Country Code */}
      <MobileFieldSection
        countryCode={form.countryCode}
        mobile={form.mobile}
        onCountryCodeChange={handleChange}
        onMobileChange={handleChange}
        mobileError={fieldErrors.mobile}
        countryCodeError={fieldErrors.countryCode}
      />

      {/* Email Address */}
      <EmailSection
        email={form.email}
        emailError={fieldErrors.email}
        onChange={handleChange}
      />

      {/* Password & Confirm Password */}
      <PasswordSection
        password={form.password}
        confirmPassword={form.confirmPassword}
        showPassword={showPassword}
        passwordError={fieldErrors.password}
        confirmPasswordError={fieldErrors.confirmPassword}
        onChange={handleChange}
        onTogglePassword={togglePassword}
      />

      {/* Consent Checkboxes */}
      <AuthConsentSection
        agreeToTerms={form.agreeToTerms}
        agreeToPrivacy={form.agreeToPrivacy}
        termsError={fieldErrors.agreeToTerms}
        privacyError={fieldErrors.agreeToPrivacy}
        onConsentChange={handleConsentChange}
      />

      {/* Submit Button & Sign In Link */}
      <FormSubmitButton isLoading={isLoading} />

      {/* Social Auth Providers */}
      <SocialAuthSection />
    </form>
  );
});

CreateAccountForm.displayName = 'CreateAccountForm';
