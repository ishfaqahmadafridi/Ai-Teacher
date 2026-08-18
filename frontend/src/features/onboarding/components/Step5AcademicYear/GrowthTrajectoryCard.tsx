'use client';

import { memo } from 'react';
import { Card } from '@/components/ui/card';

function GrowthTrajectoryCardComponent() {
  return (
    <Card className="w-full max-w-full bg-[#070D1A]/80 border-[#1E293B] rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl font-['Hanken_Grotesk',sans-serif]">
      <h3 className="text-lg font-bold text-white mb-6 text-center md:text-left tracking-tight">
        Your Growth Trajectory
      </h3>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Milestone Steps */}
        <div className="flex-1 space-y-4 w-full">
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-full bg-[#2563EB]/20 border border-[#2563EB] flex items-center justify-center shrink-0 text-[#38BDF8] font-bold text-xs">
              1
            </div>
            <div>
              <p className="text-white font-bold text-xs">Current Phase</p>
              <p className="text-[#94A3B8] text-[11px]">Building foundational mastery in selected subjects.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 opacity-70">
            <div className="w-9 h-9 rounded-full bg-white/5 border border-white/20 flex items-center justify-center shrink-0 text-[#94A3B8] font-bold text-xs">
              2
            </div>
            <div>
              <p className="text-white font-bold text-xs">Next Milestone</p>
              <p className="text-[#94A3B8] text-[11px]">Advanced specialization & capstone project.</p>
            </div>
          </div>
        </div>

        {/* Graduation Horizon Banner */}
        <div className="w-full md:w-1/2 p-5 bg-gradient-to-br from-[#2563EB]/15 to-[#8B5CF6]/15 border border-[#1E293B] rounded-2xl text-center space-y-1.5">
          <span className="text-2xl">🎖️</span>
          <p className="text-xs font-bold uppercase tracking-widest text-[#C4B5FD]">Graduation Horizon</p>
          <p className="text-[11px] text-[#94A3B8]">Personalized AI roadmap unlocked based on your year selection.</p>
        </div>
      </div>
    </Card>
  );
}

export const GrowthTrajectoryCard = memo(GrowthTrajectoryCardComponent);
GrowthTrajectoryCard.displayName = 'GrowthTrajectoryCard';
