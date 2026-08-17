'use client';

import { memo } from 'react';
import type { LandingNavbarProps } from '../../types/intro.types';
import { BRAND_CONFIG } from '../../constants/introConstants';

export const LandingNavbar = memo(function LandingNavbar({
  onEnterApp,
  onLogin,
}: LandingNavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 bg-[#0d141d]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1px] shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <div className="w-full h-full bg-[#0d141d] rounded-[11px] flex items-center justify-center text-cyan-400">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
          </div>
          <div>
            <span className="text-lg font-bold tracking-wider text-white font-mono">
              {BRAND_CONFIG.name}
            </span>
            <span className="hidden sm:block text-[10px] text-cyan-400/80 font-mono tracking-widest uppercase">
              AI Education & Learning Platform
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onLogin}
            className="px-5 py-2 rounded-full text-xs font-semibold text-blue-200/80 hover:text-white border border-transparent hover:border-white/10 transition-all duration-200"
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={onEnterApp}
            className="px-5 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-200 active:scale-95"
          >
            Launch Platform
          </button>
        </div>
      </div>
    </header>
  );
});

LandingNavbar.displayName = 'LandingNavbar';
