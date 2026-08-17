'use client';

import { memo } from 'react';
import { useLoginPage } from '../../hooks/useLoginPage';
import { LoginHeader } from './LoginHeader';
import { LoginFormFields } from './LoginFormFields';
import { LoginSocialButtons } from './LoginSocialButtons';
import { LoginHeroPanel } from './LoginHeroPanel';

export const LoginPage = memo(function LoginPage() {
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
    <div
      className="min-h-screen w-full flex relative overflow-hidden"
      style={{ background: '#0d141d', fontFamily: 'var(--font-outfit), var(--font-inter), sans-serif' }}
    >
      {/* Left Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 relative z-10">
        {/* Ambient background orbs */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-10%', left: '-5%',
            width: '55vw', height: '55vw',
            maxWidth: 700, maxHeight: 700,
            background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: '-15%', right: '-5%',
            width: '50vw', height: '50vw',
            maxWidth: 600, maxHeight: 600,
            background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        {/* Glass Card */}
        <div
          className="relative z-10 w-full max-w-[480px] rounded-3xl px-8 sm:px-12 py-10 shadow-2xl"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 64px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.06)',
          }}
        >
          <LoginHeader />

          <LoginFormFields
            form={form}
            showPassword={showPassword}
            isLoading={isLoading}
            error={error}
            onChange={handleChange}
            onTogglePassword={togglePassword}
            onSubmit={handleSubmit}
          />

          <LoginSocialButtons />
        </div>
      </div>

      {/* Right Hero Panel */}
      <LoginHeroPanel />
    </div>
  );
});

LoginPage.displayName = 'LoginPage';
