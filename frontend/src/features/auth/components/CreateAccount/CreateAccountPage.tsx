'use client';

import { memo } from 'react';
import Image from 'next/image';
import { Brain } from 'lucide-react';
import { useRegister } from '../../hooks/useRegister';
import { CreateAccountForm } from './CreateAccountForm';

export const CreateAccountPage = memo(function CreateAccountPage() {
  const registerState = useRegister();

  return (
    <div
      className="min-h-screen w-full flex relative overflow-hidden"
      style={{ background: '#0d141d', fontFamily: 'var(--font-outfit), var(--font-inter), sans-serif' }}
    >
      {/* ── Left Form Panel ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 relative z-10 overflow-y-auto">
        {/* Ambient glow orbs */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-10%',
            left: '-5%',
            width: '55vw',
            height: '55vw',
            maxWidth: 700,
            maxHeight: 700,
            background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: '-15%',
            right: '-5%',
            width: '50vw',
            height: '50vw',
            maxWidth: 600,
            maxHeight: 600,
            background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        {/* Glass Card */}
        <div
          className="relative z-10 w-full max-w-[540px] rounded-3xl px-8 sm:px-12 py-10 shadow-2xl my-auto"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 64px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.06)',
          }}
        >
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
            Create Account
          </h1>
          <p className="text-[#94a3b8] text-base mb-8">
            Begin your high-tech gateway to the future of learning.
          </p>

          {/* Form Component */}
          <CreateAccountForm {...registerState} />
        </div>
      </div>

      {/* ── Right Hero Panel ── */}
      <div className="hidden lg:block lg:w-1/2 relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[#0d141d]/30 z-10 pointer-events-none" />
        <Image
          src="/ai-mentor-bg.png"
          alt="AI Teacher interactive mentor learning scene"
          fill
          sizes="50vw"
          priority
          className="object-cover"
        />
        {/* Edge blend */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0d141d] via-[#0d141d]/70 to-transparent z-20 pointer-events-none" />
      </div>
    </div>
  );
});

CreateAccountPage.displayName = 'CreateAccountPage';
