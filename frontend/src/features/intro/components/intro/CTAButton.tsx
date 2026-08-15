'use client';

import { memo } from 'react';
import { useCTAButton } from '../../hooks';

export const CTAButton = memo(function CTAButton() {
  const {
    ctaHovered,
    handleMouseEnter,
    handleMouseLeave,
    handleEnterPlatform,
  } = useCTAButton();

  return (
    <div className="mt-12">
      <button
        type="button"
        onClick={handleEnterPlatform}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="intro-cta-btn inline-flex items-center gap-3 px-11 py-[18px] rounded-full border border-blue-300/25 bg-white/[0.06] backdrop-blur-xl cursor-pointer outline-none text-[#e0f0ff] font-semibold text-[16px] tracking-wide hover:bg-white/[0.12] hover:border-blue-400/40 transition-all duration-300 shadow-[0_0_30px_rgba(37,99,235,0.2)]"
        style={{
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <span>Enter Learning Platform</span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          className="transition-transform duration-300 ease-out"
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
      </button>
    </div>
  );
});

CTAButton.displayName = 'CTAButton';
