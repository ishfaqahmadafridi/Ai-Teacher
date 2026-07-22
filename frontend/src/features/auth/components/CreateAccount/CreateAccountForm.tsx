'use client';

import { useRegister } from '../../hooks/useRegister';
import { AuthError } from './AuthError';
import { IdentityRow } from './IdentityRow';
import { ContactRow } from './ContactRow';
import { EmailFieldSection } from './EmailFieldSection';
import { PasswordRow } from './PasswordRow';
import { AuthConsent } from './AuthConsent';
import { SocialAuth } from './SocialAuth';
import { FormActions } from './FormActions';
import type { CreateAccountFormProps } from '../../types';

export function CreateAccountForm({ onSuccess }: CreateAccountFormProps) {
  const {
    form,
    fieldErrors,
    isLoading,
    error,
    handleChange,
    handleConsentChange,
    handleSubmit,
  } = useRegister();

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>

      {/* Global error banner */}
      <AuthError message={error ?? ''} />

      {/* First Name / Last Name */}
      <IdentityRow
        form={form}
        fieldErrors={fieldErrors}
        onChange={handleChange}
      />

      {/* Username / Mobile */}
      <ContactRow
        form={form}
        onChange={handleChange}
      />

      {/* Email */}
      <EmailFieldSection
        value={form.email}
        error={fieldErrors.email}
        onChange={handleChange}
      />

      {/* Password / Confirm Password */}
      <PasswordRow
        form={form}
        fieldErrors={fieldErrors}
        onChange={handleChange}
      />

      {/* Terms & Privacy checkboxes */}
      <AuthConsent
        agreeToTerms={form.agreeToTerms}
        agreeToPrivacy={form.agreeToPrivacy}
        onTermsChange={(checked) => handleConsentChange('agreeToTerms', checked)}
        onPrivacyChange={(checked) => handleConsentChange('agreeToPrivacy', checked)}
      />
      {(fieldErrors.agreeToTerms || fieldErrors.agreeToPrivacy) && (
        <p className="text-xs text-[#ffb4ab] pl-1">
          {fieldErrors.agreeToTerms ?? fieldErrors.agreeToPrivacy}
        </p>
      )}

      {/* Submit + Sign-in link */}
      <FormActions isLoading={isLoading} />

      {/* Social auth (Google / Microsoft / Apple) */}
      <SocialAuth />

    </form>
  );
}
