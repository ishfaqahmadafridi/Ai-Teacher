/**
 * features/auth/types/index.ts
 *
 * Barrel export for all auth feature TypeScript types.
 * Always import from here, not from auth.types.ts directly:
 *   import type { RegisterFormData, AuthUser } from '@/features/auth/types';
 */
export type {
  AuthRole,
  RegisterFormData,
  LoginFormData,
  AuthUser,
  AuthState,
  CreateAccountFormProps,
  AuthHeaderProps,
  SocialAuthProps,
  PasswordFieldProps,
  AuthFieldProps,
  AuthErrorProps,
  AuthConsentProps,
  VerificationMethod,
  VerifyOtpFormData,
  MethodSelectorProps,
  OtpInputGroupProps,
  ResendTimerProps,
} from './auth.types';
