'use client';

import Link from 'next/link';
import { Brain } from 'lucide-react';
import type { OnboardingHeaderProps } from '../types';

export function OnboardingHeader({
  className = '',
  logoHref = '/',
  showNav = true,
  showAction = true,
}: OnboardingHeaderProps) {
  return (
    <header className={`fixed top-0 w-full z-50 bg-[#0a0f1d]/75 backdrop-blur-[30px] border-b border-white/10 ${className}`}>
      <div className="flex justify-between items-center px-4 md:px-10 py-3.5 max-w-[1280px] mx-auto">
        <Link href={logoHref} className="flex items-center gap-3.5 no-underline select-none group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1d4ed8] via-[#2563eb] to-[#38bdf8] text-white flex items-center justify-center shadow-lg shadow-[#2563eb]/30 shrink-0 group-hover:scale-105 transition-transform duration-200">
            <Brain className="w-5.5 h-5.5 text-white" aria-hidden="true" />
          </div>
          <span className="font-extrabold tracking-[0.14em] uppercase text-white group-hover:text-[#38bdf8] transition-colors text-lg font-['Hanken_Grotesk',sans-serif]">
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
}
