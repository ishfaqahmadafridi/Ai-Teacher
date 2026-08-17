'use client';

import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { OnboardingHeaderProps } from '../types';

export const OnboardingHeader = memo(function OnboardingHeader({
  className = '',
  logoHref = '/',
  showNav = true,
  showAction = true,
}: OnboardingHeaderProps) {
  return (
    <header className={`fixed top-0 w-full z-50 bg-[#0a0f1d]/75 backdrop-blur-[30px] border-b border-white/10 ${className}`}>
      <div className="flex justify-between items-center px-4 md:px-10 py-3.5 max-w-[1280px] mx-auto">
        <Link href={logoHref} className="flex items-center gap-3 no-underline select-none group">
          <div className="relative w-11 h-11 shrink-0 group-hover:scale-105 transition-transform duration-200">
            <Image
              src="/neurolearn-brain-logo.png"
              alt="NEUROLEARN Logo"
              fill
              sizes="44px"
              className="object-contain rounded-lg mix-blend-screen"
              style={{
                mixBlendMode: 'screen',
                filter: 'drop-shadow(0 0 12px rgba(56,189,248,0.9))',
              }}
              priority
            />
          </div>
          <span className="font-extrabold tracking-[0.14em] uppercase text-white group-hover:text-[#38bdf8] transition-colors text-lg font-['Outfit',sans-serif]">
            NEUROLEARN
          </span>
        </Link>

        {/* Center Navigation Links */}
        {showNav && (
          <div className="hidden md:flex gap-8 text-sm font-medium">
            <Link href="/" className="text-[#c6c6cc] hover:text-white transition-colors no-underline">
              Curriculum
            </Link>
            <Link href="/" className="text-[#c6c6cc] hover:text-white transition-colors no-underline">
              Mentors
            </Link>
            <Link href="/" className="text-[#c6c6cc] hover:text-white transition-colors no-underline">
              Network
            </Link>
          </div>
        )}

        {/* Get Started Action */}
        {showAction && (
          <div>
            <Link
              href="/register"
              className="px-5 py-2 rounded-full bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold tracking-wide shadow-md transition-all no-underline inline-block"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
});

OnboardingHeader.displayName = 'OnboardingHeader';
