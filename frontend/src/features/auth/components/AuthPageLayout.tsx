'use client';

import { memo } from 'react';
import type { AuthPageLayoutProps } from '../types/authLayout.types';

export const AuthPageLayout = memo(function AuthPageLayout({ children }: AuthPageLayoutProps) {
  return (
    <main className="min-h-dvh w-full bg-dashboard-panel flex items-center justify-center text-dashboard-text font-sans">
      <div className="w-full min-h-dvh lg:grid lg:grid-cols-[1fr_1fr]">
        {children}
      </div>
    </main>
  );
});

AuthPageLayout.displayName = 'AuthPageLayout';
