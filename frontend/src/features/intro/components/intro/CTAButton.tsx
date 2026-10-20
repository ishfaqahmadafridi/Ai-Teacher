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
        className="group relative inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-xl bg-dashboard-primary hover:bg-dashboard-primary-hover text-white font-semibold text-base shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dashboard-primary no-underline"
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
            stroke="currentColor"
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
