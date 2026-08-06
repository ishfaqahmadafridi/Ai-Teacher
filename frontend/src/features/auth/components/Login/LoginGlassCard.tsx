'use client';

import type { LoginGlassCardProps } from '../../types';

export function LoginGlassCard({ children, className = '' }: LoginGlassCardProps) {
  return (
    <div className={`glass-card rounded-2xl p-6 sm:p-10 w-full max-w-lg shadow-2xl relative overflow-hidden z-10 my-auto ${className}`}>
      {/* Subtle inner glow */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none border border-[#2e5bff]/10" />
      {children}
    </div>
  );
}
