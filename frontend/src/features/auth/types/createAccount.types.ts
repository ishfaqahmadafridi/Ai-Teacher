import type { ChangeEvent, HTMLInputTypeAttribute } from 'react';
import type { RegisterFormData } from './domain.types';

// ─── Country Code Option ──────────────────────────────────────────────────────
export interface CountryCodeOption {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
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

// ─── AuthField (generic text/email/tel input) ─────────────────────────────────
export interface AuthFieldProps extends BaseInputFieldProps {
  type?: HTMLInputTypeAttribute;
  className?: string;
}

// ─── PasswordField (adds password-specific toggle behaviour) ──────────────────
export interface PasswordFieldProps extends BaseInputFieldProps {
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

// ─── Mobile Field with Country Code ───────────────────────────────────────────
export interface MobileFieldSectionProps {
  countryCode: string;
  mobile: string;
  onCountryCodeChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onMobileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  mobileError?: string;
  countryCodeError?: string;
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
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  togglePassword: () => void;
  onSuccess?: () => void;
}

// ─── Header ───────────────────────────────────────────────────────────────────
export interface AuthHeaderProps {
  title?: string;
  subtitle?: string;
}

// ─── Global error banner ──────────────────────────────────────────────────────
export interface AuthErrorProps {
  message: string;
}

// ─── Consent checkboxes ───────────────────────────────────────────────────────
export interface AuthConsentProps {
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  onTermsChange: (checked: boolean) => void;
  onPrivacyChange: (checked: boolean) => void;
  termsError?: string;
  privacyError?: string;
}

// ─── Social sign-in section ───────────────────────────────────────────────────
export interface SocialAuthProps {
  showDivider?: boolean;
  dividerText?: string;
  onGoogleClick?: () => void;
  onMicrosoftClick?: () => void;
  onAppleClick?: () => void;
}
