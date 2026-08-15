'use client';

import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRegisterPage } from '../hooks/useRegisterPage';
import { RegisterFormFields } from './register/RegisterFormFields';

export const RegisterPage = memo(function RegisterPage() {
  const {
    form,
    showPassword,
    isLoading,
    error,
    handleChange,
    togglePassword,
    handleSubmit,
  } = useRegisterPage();

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{ background: '#0d141d', fontFamily: 'var(--font-outfit), var(--font-inter), sans-serif' }}
    >
      {/* ── Ambient background orbs ── */}
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

      {/* ── Card ── */}
      <div
        className="relative w-full max-w-md mx-4 rounded-2xl p-8 md:p-10"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(99,179,237,0.12)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 60px rgba(59,130,246,0.06)',
          animation: 'intro-fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both',
        }}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="relative" style={{ width: 60, height: 60 }}>
            <Image
              src="/neurolearn-logo.png"
              alt="NeuroLearn"
              fill
              sizes="60px"
              className="object-contain"
              style={{ filter: 'drop-shadow(0 0 10px rgba(79,195,247,0.75))' }}
            />
          </div>
          <span
            className="font-extrabold tracking-[0.14em] uppercase text-white"
            style={{ fontSize: '1.05rem' }}
          >
            NEUROLEARN
          </span>
        </div>

        <h1 className="text-2xl font-bold text-center text-white mb-1">
          Create your account
        </h1>
        <p className="text-center text-blue-200/50 text-sm mb-8">
          Start your AI learning journey today
        </p>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 px-4 py-2.5 rounded-lg text-sm text-red-300 bg-red-500/10 border border-red-500/20">
            {error}
          </div>
        )}

        {/* Form Fields Component */}
        <RegisterFormFields
          form={form}
          showPassword={showPassword}
          isLoading={isLoading}
          onChange={handleChange}
          onTogglePassword={togglePassword}
          onSubmit={handleSubmit}
        />

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-blue-200/10" />
          <span className="text-xs text-blue-200/30">or</span>
          <div className="flex-1 h-px bg-blue-200/10" />
        </div>

        {/* Footer Links */}
        <p className="text-center text-blue-200/40 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
            Sign in
          </Link>
        </p>

        <p className="text-center text-blue-200/25 text-xs mt-4">
          By registering you agree to our{' '}
          <span className="text-blue-400/60">Terms</span> &amp;{' '}
          <span className="text-blue-400/60">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
});

RegisterPage.displayName = 'RegisterPage';
