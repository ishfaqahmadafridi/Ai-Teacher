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
          className="object-contain rounded-lg"
          priority
        />
      </div>
      <span
        className="font-semibold tracking-tight text-dashboard-text group-hover:text-dashboard-primary transition-colors"
        style={{
          fontSize: '1.25rem',
          fontFamily: 'var(--font-outfit), sans-serif',
          letterSpacing: '-0.025em',
        }}
      >
        Neurolearn
      </span>
    </Link>
  );
});

Logo.displayName = 'Logo';
