'use client';

import { memo } from 'react';

export const AmbientOrbs = memo(function AmbientOrbs() {
  return (
    <>
      {/* Glow Orbs */}
      <div className="absolute top-[-20%] left-[15%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,_rgba(29,_78,_216,_0.35)_0%,_rgba(29,_78,_216,_0.08)_50%,_transparent_70%)] pointer-events-none z-[2] intro-orb-pulse-1" />
      <div className="absolute bottom-[-10%] right-[10%] w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,_rgba(79,_30,_180,_0.3)_0%,_rgba(79,_30,_180,_0.06)_50%,_transparent_70%)] pointer-events-none z-[2] intro-orb-pulse-2" />
      <div className="absolute top-[40%] left-[-8%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,_rgba(6,_182,_212,_0.2)_0%,_transparent_70%)] pointer-events-none z-[2] intro-orb-pulse-3" />

      {/* Grid Tech Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 179, 237, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 179, 237, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'intro-gridPulse 6s ease-in-out infinite',
        }}
      />

      {/* Scan Line */}
      <div
        className="absolute left-0 right-0 h-[2px] pointer-events-none z-[3]"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(99,179,237,0.12) 30%, rgba(148,210,255,0.18) 50%, rgba(99,179,237,0.12) 70%, transparent 100%)',
          animation: 'intro-scanLine 14s linear 3s infinite',
        }}
      />
    </>
  );
});

AmbientOrbs.displayName = 'AmbientOrbs';
