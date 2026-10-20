'use client';

import { memo } from 'react';
import type { LoginHeaderProps } from '../../types';

export const LoginHeader = memo(function LoginHeader({
  title = 'Welcome Back',
  subtitle = 'Sign in to continue your AI learning journey.',
}: LoginHeaderProps) {
  return (
    <>
      {/* Heading */}
      <h1 className="text-3xl sm:text-4xl font-semibold text-dashboard-text mb-2 tracking-tight">
        {title}
      </h1>
      <p className="text-dashboard-muted text-base mb-8">
        {subtitle}
      </p>
    </>
  );
});

LoginHeader.displayName = 'LoginHeader';
