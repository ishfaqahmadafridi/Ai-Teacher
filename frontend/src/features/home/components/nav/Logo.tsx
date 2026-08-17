'use client';

import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const Logo = memo(function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 no-underline select-none group">
      <div className="relative w-11 h-11 shrink-0 group-hover:scale-105 transition-transform duration-200">
        <Image
          src="/neurolearn-brain-logo.png"
          alt="NeuroLearn Neural Brain Logo"
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
        className="font-extrabold tracking-[0.14em] uppercase text-white group-hover:text-[#38bdf8] transition-colors"
        style={{
          fontSize: '1.25rem',
          fontFamily: 'var(--font-outfit), sans-serif',
          letterSpacing: '0.14em',
        }}
      >
        NEUROLEARN
      </span>
    </Link>
  );
});

Logo.displayName = 'Logo';
