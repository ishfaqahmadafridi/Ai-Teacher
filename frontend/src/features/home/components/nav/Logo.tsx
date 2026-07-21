'use client';

import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 no-underline select-none">
      <span
        className="font-extrabold tracking-[0.12em] uppercase text-white"
        style={{
          fontSize: '1.05rem',
          fontFamily: 'var(--font-outfit), sans-serif',
          letterSpacing: '0.14em',
        }}
      >
        NEUROLEARN
      </span>
      <div className="relative" style={{ width: 64, height: 64, flexShrink: 0, marginTop: '-12px', marginBottom: '-12px' }}>
        <Image
          src="/neurolearn-logo.png"
          alt="NeuroLearn Logo"
          fill
          sizes="64px"
          className="object-contain"
          style={{ filter: 'drop-shadow(0 0 10px rgba(79,195,247,0.75))' }}
          priority
        />
      </div>
    </Link>
  );
}
