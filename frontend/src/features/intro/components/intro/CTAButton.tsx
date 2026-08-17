'use client';

import { memo } from 'react';
import Link from 'next/link';
import { useCTAButton } from '../../hooks/useCTAButton';
import type { CTAButtonProps } from '../../types/intro.types';

export const CTAButton = memo(function CTAButton({
  label = 'Enter Learning Platform',
  onNavigate,
  className = '',
}: CTAButtonProps) {
  const { ctaHovered, handleMouseEnter, handleMouseLeave, handleClick } =
    useCTAButton(onNavigate);

  return (
    <div className={`mt-7 relative z-50 pointer-events-auto ${className}`}>
      <Link
        href="/home"
        prefetch={true}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="intro-cta-btn group relative inline-flex items-center gap-3 px-11 py-[18px] rounded-full border border-cyan-400/30 bg-gradient-to-r from-cyan-500/20 via-blue-600/20 to-purple-600/20 backdrop-blur-xl cursor-pointer outline-none text-[#e0f0ff] font-semibold text-[16px] tracking-wide shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:shadow-[0_0_45px_rgba(6,182,212,0.45)] hover:border-cyan-400/60 transition-all duration-300 active:scale-[0.98] no-underline"
        style={{
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <span>{label}</span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          className="transition-transform duration-300 ease-out group-hover:translate-x-1"
          style={{
            transform: ctaHovered ? 'translateX(4px)' : 'translateX(0)',
          }}
        >
          <path
            d="M3.75 9H14.25M14.25 9L9.75 4.5M14.25 9L9.75 13.5"
            stroke="rgba(147, 197, 253, 0.9)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </div>
  );
});

CTAButton.displayName = 'CTAButton';
