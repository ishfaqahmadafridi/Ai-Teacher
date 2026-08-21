import type { ChangeEvent, HTMLInputTypeAttribute, FormEvent } from 'react';
import type { RegisterFormData } from './domain.types';

// ─── Country Code & Social Provider Options ──────────────────────────────────
export interface CountryCodeOption {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

export interface SocialProviderOption {
  id: string;
  label: string;
  provider: 'google' | 'microsoft' | 'apple';
}

// ─── Shared base for all auth input fields ────────────────────────────────────
export interface BaseInputFieldProps {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  autoComplete?: string;
  error?: string;
}

export interface AuthFieldProps extends BaseInputFieldProps {
  type?: HTMLInputTypeAttribute;
  className?: string;
}

export interface PasswordFieldProps extends BaseInputFieldProps {
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

// ─── Section Component Props ──────────────────────────────────────────────────
export interface IdentitySectionProps {
  firstName: string;
  lastName: string;
  firstNameError?: string;
  lastNameError?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface UsernameSectionProps {
  username: string;
  usernameError?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface EmailSectionProps {
  email: string;
  emailError?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface MobileFieldSectionProps {
  countryCode: string;
  mobile: string;
  onCountryCodeChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onMobileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  mobileError?: string;
  countryCodeError?: string;
}

export interface PasswordSectionProps {
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  passwordError?: string;
  confirmPasswordError?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onTogglePassword: () => void;
}

export interface AuthConsentSectionProps {
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  termsError?: string;
  privacyError?: string;
  onConsentChange: (field: 'agreeToTerms' | 'agreeToPrivacy', checked: boolean) => void;
}

export interface ConsentErrorProps {
  id: string;
  message: string;
}

export interface ConsentLinkProps {
  href: string;
  text: string;
}

export interface ConsentLabelProps {
  htmlFor: string;
  labelPrefix: string;
  linkHref: string;
  linkText: string;
}

export interface AuthConsentProps {
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  onTermsChange: (checked: boolean) => void;
  onPrivacyChange: (checked: boolean) => void;
  termsError?: string;
  privacyError?: string;
}

export interface FormSubmitButtonProps {
  isLoading: boolean;
  loadingText?: string;
  buttonText?: string;
}

// ─── Form-level props ─────────────────────────────────────────────────────────
export interface CreateAccountFormProps {
  form: RegisterFormData;
  fieldErrors: Partial<Record<keyof RegisterFormData, string>>;
  showPassword: boolean;
  isLoading: boolean;
  error: string | null;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleConsentChange: (field: 'agreeToTerms' | 'agreeToPrivacy', checked: boolean) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  togglePassword: () => void;
  onSuccess?: () => void;
}



export interface AuthHeaderProps {
  title?: string;
  subtitle?: string;
}

export interface AuthErrorProps {
  message: string;
}

export interface SocialAuthProps {
  showDivider?: boolean;
  dividerText?: string;
  onGoogleClick?: () => void;
  onMicrosoftClick?: () => void;
  onAppleClick?: () => void;
}

export type SocialAuthSectionProps = SocialAuthProps;
