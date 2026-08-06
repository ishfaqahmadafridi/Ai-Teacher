'use client';

import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <div className={`glass-card rounded-2xl p-6 sm:p-8 w-full max-w-xl shadow-2xl relative overflow-hidden z-10 my-auto ${className}`}>
      {/* Subtle inner glow */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none border border-[#2e5bff]/10" />
      {children}
    </div>
  );
}

