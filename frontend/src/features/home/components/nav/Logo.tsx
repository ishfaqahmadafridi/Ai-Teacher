'use client';

import Link from 'next/link';
import { Brain } from 'lucide-react';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3.5 no-underline select-none group">
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1d4ed8] via-[#2563eb] to-[#38bdf8] text-white flex items-center justify-center shadow-lg shadow-[#2563eb]/30 shrink-0 group-hover:scale-105 transition-transform duration-200">
        <Brain className="w-5.5 h-5.5 text-white" aria-hidden="true" />
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
}
