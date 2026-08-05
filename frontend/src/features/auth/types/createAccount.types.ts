import type { ChangeEvent } from 'react';

export interface CreateAccountFormProps {
  onSuccess?: () => void;
}

export interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}

export interface SocialAuthProps {
  showDivider?: boolean;
  dividerText?: string;
  onGoogleClick?: () => void;
  onMicrosoftClick?: () => void;
  onAppleClick?: () => void;
}

export interface PasswordFieldProps {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  autoComplete?: string;
}

export interface AuthFieldProps {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  autoComplete?: string;
}

export interface AuthErrorProps {
  message: string;
}

export interface AuthConsentProps {
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  onTermsChange: (checked: boolean) => void;
  onPrivacyChange: (checked: boolean) => void;
}
