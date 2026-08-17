'use client';

import { memo } from 'react';
import { useLoginPage } from '../../hooks/useLoginPage';
import { LoginFormFields } from './LoginFormFields';

export const LoginForm = memo(function LoginForm() {
  const {
    form,
    showPassword,
    isLoading,
    error,
    handleChange,
    togglePassword,
    handleSubmit,
  } = useLoginPage();

  return (
    <LoginFormFields
      form={form}
      showPassword={showPassword}
      isLoading={isLoading}
      error={error}
      onChange={handleChange}
      onTogglePassword={togglePassword}
      onSubmit={handleSubmit}
    />
  );
});

LoginForm.displayName = 'LoginForm';
