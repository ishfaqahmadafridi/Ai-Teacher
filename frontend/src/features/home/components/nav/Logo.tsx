'use client';

import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 no-underline select-none group">
      <span
        className="font-extrabold tracking-[0.14em] uppercase text-white group-hover:text-[#38bdf8] transition-colors"
        style={{
          fontSize: '1.2rem',
          fontFamily: 'var(--font-outfit), sans-serif',
          letterSpacing: '0.14em',
        }}
      >
        NEUROLEARN
      </span>
      <div className="relative w-12 h-12 shrink-0">
        <Image
          src="/neurolearn-brain-logo.png"
          alt="NeuroLearn Neural Brain Logo"
          fill
          sizes="48px"
          className="object-contain"
          style={{ filter: 'drop-shadow(0 0 12px rgba(56,189,248,0.8))' }}
          priority
        />
      </div>
    </Link>
  );
}
