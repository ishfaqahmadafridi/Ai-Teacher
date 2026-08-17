'use client';

import { memo } from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles, ShieldCheck } from 'lucide-react';
import type { AIMentorBannerCardProps } from '../../types';

function AIMentorBannerCardComponent({ className = '' }: AIMentorBannerCardProps) {
  return (
    <Card className={`bg-[#070D1A]/90 border border-[#1E293B] backdrop-blur-2xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden font-['Hanken_Grotesk',sans-serif] ${className}`}>
      {/* Top Ambient Glow */}
      <div className="absolute top-0 right-0 w-56 h-56 bg-[#2563EB]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#2563EB]/20 border border-[#2563EB]/40 flex items-center justify-center text-[#38BDF8]">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-extrabold text-white uppercase tracking-wide">
            AI Personalized Experience
          </h4>
          <p className="text-xs text-[#94A3B8]">
            Adapts study schedule to your timezone & region.
          </p>
        </div>
      </div>

      <p className="text-xs text-[#c6c6cc] leading-relaxed">
        Your profile details enable AI Teacher to generate tailored lesson reminders, deadline countdowns, and localized academic recommendations.
      </p>

      <div className="flex items-center gap-2 pt-2 border-t border-[#1E293B] text-[11px] text-[#10B981] font-semibold">
        <ShieldCheck className="w-4 h-4 shrink-0" />
        <span>Your data is encrypted & stored securely.</span>
      </div>
    </Card>
  );
}

export const AIMentorBannerCard = memo(AIMentorBannerCardComponent);
AIMentorBannerCard.displayName = 'AIMentorBannerCard';
