'use client';

import { LiveDotsBackground } from './LiveDotsBackground';
import { LoginGlassCard } from './LoginGlassCard';
import { LoginHeader } from './LoginHeader';
import { LoginForm } from './LoginForm';
import type { LoginFormPanelProps } from '../../types';

export function LoginFormPanel({ className = '' }: LoginFormPanelProps) {
  return (
    <div className={`w-full lg:w-1/2 lg:min-w-[50%] lg:max-w-[50%] flex items-center justify-center p-4 sm:p-8 z-10 relative min-h-screen overflow-y-auto py-12 ${className}`}>
      <LiveDotsBackground />
      <LoginGlassCard>
        <LoginHeader />
        <LoginForm />
      </LoginGlassCard>
    </div>
  );
}
