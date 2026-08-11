'use client';

import { memo } from 'react';
import type { DashboardHeroSectionProps } from '../../types';

export const DashboardHeroSection = memo(function DashboardHeroSection({
  studentName = 'John',
  weeklyProgressPercent = 75,
  className = '',
}: DashboardHeroSectionProps) {
  return (
    <section
      className={`bg-gradient-to-r from-[#0C3B73] via-[#0E4482] to-[#0A305E] rounded-20 p-6 sm:p-8 md:p-10 flex flex-col md:flex-row justify-between items-center relative overflow-hidden font-['Hanken_Grotesk',sans-serif] shadow-lg gap-6 ${className}`}
    >
      {/* Decorative Star Particles in Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" aria-hidden="true">
        <svg className="w-full h-full" viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="120" cy="40" r="1.5" fill="white" />
          <circle cx="280" cy="80" r="1" fill="white" />
          <circle cx="450" cy="30" r="2" fill="white" />
          <circle cx="620" cy="90" r="1.5" fill="white" />
          <circle cx="720" cy="50" r="1" fill="white" />
        </svg>
      </div>

      {/* Left Greeting & Subtitle */}
      <div className="z-10 flex-1 min-w-0 text-white space-y-3 py-1">
        <h1 className="font-['Hanken_Grotesk',sans-serif] text-3xl sm:text-4xl lg:text-[40px] font-bold text-white tracking-tight leading-tight">
          Good Morning, {studentName}
        </h1>
        <p className="font-['Hanken_Grotesk',sans-serif] text-base sm:text-lg text-[#E2E8F0] leading-relaxed max-w-2xl">
          You've learned{' '}
          <span className="font-extrabold text-[#FF6B35] drop-shadow-sm whitespace-nowrap">
            {weeklyProgressPercent}% of your
          </span>{' '}
          goal this week! Keep it up and improve your results!
        </p>
      </div>

      {/* Right Student Desk Study SVG Illustration */}
      <div className="z-10 shrink-0 flex justify-center md:justify-end mt-2 md:mt-0">
        <div className="w-56 h-36 sm:w-64 sm:h-44 md:w-72 md:h-48">
          <svg
            viewBox="0 0 320 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-md"
          >
            {/* Starry Night Window Frame */}
            <rect x="200" y="20" width="85" height="100" rx="4" fill="#071E3D" stroke="#1A365D" strokeWidth="3" />
            {/* Window Grid Divider */}
            <line x1="200" y1="70" x2="285" y2="70" stroke="#1A365D" strokeWidth="2" />
            <line x1="242" y1="20" x2="242" y2="120" stroke="#1A365D" strokeWidth="2" />
            {/* Moon in Window */}
            <circle cx="265" cy="40" r="10" fill="#E2E8F0" opacity="0.8" />
            <circle cx="262" cy="38" r="8" fill="#071E3D" />
            {/* Stars in Window */}
            <circle cx="215" cy="35" r="1" fill="#FFFFFF" />
            <circle cx="230" cy="55" r="1.2" fill="#FFFFFF" />
            <circle cx="220" cy="90" r="1" fill="#FFFFFF" />
            <circle cx="270" cy="95" r="1" fill="#FFFFFF" />

            {/* Wall Picture Frames */}
            <rect x="255" y="65" width="22" height="18" rx="2" fill="#0F2B48" stroke="#1A365D" strokeWidth="1.5" />
            <rect x="250" y="90" width="28" height="22" rx="2" fill="#0F2B48" stroke="#1A365D" strokeWidth="1.5" />

            {/* Desk Surface */}
            <rect x="180" y="140" width="135" height="6" fill="#1E293B" />
            {/* Desk Legs & Drawers */}
            <rect x="185" y="146" width="30" height="45" fill="#0F172A" rx="2" />
            <line x1="185" y1="160" x2="215" y2="160" stroke="#334155" strokeWidth="1" />
            <line x1="185" y1="175" x2="215" y2="175" stroke="#334155" strokeWidth="1" />
            <circle cx="200" cy="153" r="1.5" fill="#94A3B8" />
            <circle cx="200" cy="167" r="1.5" fill="#94A3B8" />
            <circle cx="200" cy="182" r="1.5" fill="#94A3B8" />
            <rect x="295" y="146" width="6" height="45" fill="#0F172A" />

            {/* Desk Clock & Books */}
            <rect x="220" y="132" width="18" height="8" rx="2" fill="#3B82F6" />
            <rect x="188" y="134" width="16" height="6" rx="1" fill="#E2E8F0" />

            {/* Desk Lamp Beam */}
            <polygon points="215,80 180,140 260,140" fill="#FDE047" opacity="0.15" />
            {/* Desk Lamp */}
            <path d="M225,140 L220,105 L210,85" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" />
            <path d="M205,80 L220,88 L212,96 Z" fill="#FF6B35" />

            {/* Student Sitting at Chair */}
            {/* Chair Base */}
            <rect x="250" y="135" width="22" height="45" rx="3" fill="#1E3A8A" />
            <rect x="258" y="180" width="6" height="15" fill="#0F172A" />
            {/* Student Legs */}
            <path d="M245,150 L230,175 L200,185" stroke="#C2410C" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M200,185 L195,190" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
            {/* Student Body & Shirt */}
            <path d="M260,125 L245,150 L235,145" fill="#E2E8F0" />
            <path d="M265,115 L248,150" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" />
            {/* Student Head & Hair */}
            <circle cx="265" cy="100" r="9" fill="#FFD1BA" />
            <path d="M260,92 C265,88 275,92 273,105 C270,110 260,108 260,92 Z" fill="#0F172A" />
            {/* Student Arm to Laptop */}
            <path d="M255,120 L235,133 L225,133" stroke="#FFD1BA" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Laptop */}
            <polygon points="215,140 235,140 238,127 218,127" fill="#FF6B35" />
            <polygon points="218,127 238,127 236,138 216,138" fill="#F8FAFC" opacity="0.9" />

            {/* Plant Pot */}
            <path d="M295,140 L298,125 L306,125 L309,140 Z" fill="#1E293B" />
            <path d="M302,125 C295,110 305,100 302,95 C308,105 315,115 302,125 Z" fill="#10B981" />
            <path d="M302,125 C310,110 320,115 302,125 Z" fill="#059669" />
          </svg>
        </div>
      </div>
    </section>
  );
});

DashboardHeroSection.displayName = 'DashboardHeroSection';
