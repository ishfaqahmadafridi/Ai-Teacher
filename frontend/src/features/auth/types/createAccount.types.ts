import type { ChangeEvent, HTMLInputTypeAttribute } from 'react';

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
export type PasswordFieldProps = BaseInputFieldProps;

// ─── Form-level props ─────────────────────────────────────────────────────────
export interface CreateAccountFormProps {
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

// NOTE: ConsentItemProps lives in:
//   src/features/auth/components/ui/ConsentItem/ConsentItem.types.ts
// and is re-exported from the ui barrel — do NOT duplicate it here.


