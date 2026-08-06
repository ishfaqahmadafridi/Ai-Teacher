/**
 * features/auth/types/index.ts
 *
 * Barrel export for all auth feature TypeScript types.
 * Modularized sub-feature types:
 *   - domain.types.ts      : AuthUser, AuthState, RegisterFormData, LoginFormData, AuthResponseData
 *   - createAccount.types.ts: BaseInputFieldProps, AuthFieldProps, PasswordFieldProps, AuthConsentProps, etc.
 *   - login.types.ts       : Login component props
 *   - verify.types.ts      : Verification OTP component props
 */

export * from './domain.types';
export * from './createAccount.types';
export * from './login.types';
export * from './verify.types';

