'use client';

import { useLogin } from '../../hooks/useLogin';
import { AuthError } from '../CreateAccount/AuthError';
import { LoginEmailField } from './LoginEmailField';
import { LoginPasswordField } from './LoginPasswordField';
import { LoginSubmitButton } from './LoginSubmitButton';
import type { LoginFormFieldsProps } from '../../types';

export function LoginFormFields({ className = '' }: LoginFormFieldsProps) {
  const {
    form,
    fieldErrors,
    showPassword,
    isLoading,
    error,
    handleChange,
    handleSubmit,
    togglePassword,
  } = useLogin();

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`} noValidate>
      {error && <AuthError message={error} />}

      {/* Email Field Component */}
      <LoginEmailField
        value={form.email}
        onChange={handleChange}
        error={fieldErrors.email}
      />

      {/* Password Field Component */}
      <LoginPasswordField
        value={form.password}
        onChange={handleChange}
        showPassword={showPassword}
        onTogglePassword={togglePassword}
        error={fieldErrors.password}
      />

      {/* Submit Action Button Component */}
      <LoginSubmitButton isLoading={isLoading} />
    </form>
  );
}
