'use client';

import { memo } from 'react';
import type { LandingFooterProps } from '../../types/intro.types';
import { BRAND_CONFIG } from '../../constants/introConstants';

export const LandingFooter = memo(function LandingFooter({
  onNavigate,
}: LandingFooterProps) {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#080d14] text-blue-200/60 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1px]">
            <div className="w-full h-full bg-[#0d141d] rounded-[7px] flex items-center justify-center text-cyan-400 font-bold text-xs">
              NL
            </div>
          </div>
          <div>
            <span className="text-sm font-bold text-white font-mono">{BRAND_CONFIG.name}</span>
            <span className="text-xs text-blue-100/40 block">© {new Date().getFullYear()} All rights reserved.</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs font-mono">
          <button
            type="button"
            onClick={() => onNavigate?.('/home')}
            className="hover:text-cyan-400 transition-colors"
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => onNavigate?.('/classroom')}
            className="hover:text-cyan-400 transition-colors"
          >
            Physics Classroom
          </button>
          <button
            type="button"
            onClick={() => onNavigate?.('/ask')}
            className="hover:text-cyan-400 transition-colors"
          >
            AI Ask Tutor
          </button>
          <button
            type="button"
            onClick={() => onNavigate?.('/onboarding')}
            className="hover:text-cyan-400 transition-colors"
          >
            Onboarding
          </button>
        </div>

        <div className="text-xs text-blue-100/40 font-mono">
          Powered by Next.js & Django REST Architecture
        </div>
      </div>
    </footer>
  );
});

LandingFooter.displayName = 'LandingFooter';
