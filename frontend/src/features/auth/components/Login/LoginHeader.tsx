'use client';

import { memo } from 'react';
import { Brain } from 'lucide-react';
import type { LoginHeaderProps } from '../../types';

export const LoginHeader = memo(function LoginHeader({
  title = 'Welcome Back',
  subtitle = 'Sign in to continue your AI learning journey.',
}: LoginHeaderProps) {
  return (
    <>
      {/* Brand Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1d4ed8] via-[#2563eb] to-[#38bdf8] flex items-center justify-center shadow-lg shadow-[#2563eb]/30 shrink-0">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-black text-white tracking-[0.12em] uppercase">
          NEUROLEARN
        </span>
      </div>

      {/* Heading */}
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
        {title}
      </h1>
      <p className="text-[#94a3b8] text-base mb-8">
        {subtitle}
      </p>
    </>
  );
});

LoginHeader.displayName = 'LoginHeader';
