'use client';

import { memo } from 'react';
import Link from 'next/link';
import { Brain } from 'lucide-react';
import { VerifyAccountForm } from './VerifyAccountForm';

export const VerifyAccountPage = memo(function VerifyAccountPage() {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 md:px-10 py-12 relative overflow-x-hidden"
      style={{ background: '#0A0F1D', fontFamily: 'var(--font-outfit), var(--font-inter), sans-serif' }}
    >
      {/* Background glow orbs */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: '-200px',
          left: '-200px',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(184, 195, 255, 0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
          zIndex: 0,
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: '-200px',
          right: '-200px',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(221, 183, 255, 0.06) 0%, transparent 70%)',
          filter: 'blur(80px)',
          zIndex: 0,
        }}
      />

      {/* Brand Header */}
      <header
        className="fixed top-0 w-full z-50 flex justify-center items-center px-4 md:px-10 py-4"
        style={{
          background: 'rgba(10, 16, 28, 0.75)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Link href="/home" className="flex items-center gap-3.5 no-underline select-none group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1d4ed8] via-[#2563eb] to-[#38bdf8] text-white flex items-center justify-center shadow-lg shadow-[#2563eb]/30 shrink-0 group-hover:scale-105 transition-transform duration-200">
            <Brain className="w-5.5 h-5.5 text-white" aria-hidden="true" />
          </div>
          <span className="font-extrabold tracking-[0.14em] uppercase text-white group-hover:text-[#38bdf8] transition-colors text-xl font-['Hanken_Grotesk',sans-serif]">
            NEUROLEARN
          </span>
        </Link>
      </header>

      <main className="w-full max-w-2xl pt-24 pb-16 relative z-10">
        <VerifyAccountForm />
      </main>
    </div>
  );
});

VerifyAccountPage.displayName = 'VerifyAccountPage';
