import type { ChangeEvent, ReactNode } from 'react';

export interface LoginHeaderProps {
  title?: string;
  subtitle?: string;
}

export interface LoginLogoProps {
  src?: string;
  alt?: string;
  className?: string;
}

export interface LoginEmailFieldProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export interface LoginPasswordFieldProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  onTogglePassword: () => void;
  error?: string;
}

export interface LoginPasswordInputProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  onTogglePassword: () => void;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
}

export interface LoginSubmitButtonProps {
  isLoading?: boolean;
  disabled?: boolean;
}

export interface LoginSocialAuthSectionProps {
  dividerText?: string;
  onGoogleClick?: () => void;
  onMicrosoftClick?: () => void;
  onAppleClick?: () => void;
}

export interface LoginGlassCardProps {
  children: ReactNode;
  className?: string;
}

export interface LoginFormPanelProps {
  className?: string;
}

export interface HeroPanelProps {
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
}

export interface LoginFormFieldsProps {
  className?: string;
}
