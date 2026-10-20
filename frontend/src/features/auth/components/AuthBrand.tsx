'use client';

import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const AuthBrand = memo(function AuthBrand() {
  return (
    <Link href="/home" className="mb-6 inline-flex items-center gap-3 text-dashboard-text no-underline">
      <Image src="/neurolearn-brain-logo.png" alt="Neurolearn" width={40} height={40} className="rounded-lg" />
      <span className="text-xl font-semibold tracking-tight">Neurolearn</span>
    </Link>
  );
});

AuthBrand.displayName = 'AuthBrand';
