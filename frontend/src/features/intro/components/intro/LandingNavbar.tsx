'use client';

import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { LandingNavbarProps } from '../../types/intro.types';
import { BRAND_CONFIG } from '../../constants/introConstants';

export const LandingNavbar = memo(function LandingNavbar({
  onEnterApp,
}: LandingNavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 bg-[#0d141d]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Name Only */}
        <Link href="/home" prefetch={true} className="flex items-center gap-3 cursor-pointer group no-underline">
          <div className="relative w-11 h-11 shrink-0 group-hover:scale-105 transition-transform duration-200">
            <Image
              src="/neurolearn-brain-logo.png"
              alt={BRAND_CONFIG.logoAlt}
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
          <span
            className="font-extrabold tracking-[0.14em] uppercase text-white group-hover:text-[#38bdf8] transition-colors leading-tight"
            style={{
              fontSize: '1.25rem',
              fontFamily: 'var(--font-outfit), sans-serif',
              letterSpacing: '0.14em',
            }}
          >
            {BRAND_CONFIG.name}
          </span>
        </Link>
      </div>
    </header>
  );
});

LandingNavbar.displayName = 'LandingNavbar';
