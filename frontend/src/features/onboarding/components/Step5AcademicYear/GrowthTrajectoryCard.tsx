'use client';

import { Card } from '@/components/ui/card';

export function GrowthTrajectoryCard() {
  return (
    <Card className="w-full max-w-4xl bg-white/5 border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-2xl">
      <h3 className="text-xl font-bold text-white mb-6 text-center md:text-left" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        Your Growth Trajectory
      </h3>
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Milestone Steps */}
        <div className="flex-1 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#0043eb]/20 border border-[#0043eb] flex items-center justify-center shrink-0 text-white font-bold text-sm">
              1
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Current Phase</p>
              <p className="text-[#c6c6cc] text-xs">Building foundational mastery in selected subjects.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 opacity-60">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/20 flex items-center justify-center shrink-0 text-[#c6c6cc] font-bold text-sm">
              2
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Next Milestone</p>
              <p className="text-[#c6c6cc] text-xs">Advanced specialization & capstone project.</p>
            </div>
          </div>
        </div>

        {/* Graduation Horizon Banner */}
        <div className="w-full md:w-1/2 p-6 bg-gradient-to-br from-[#0043eb]/20 to-[#6900b3]/20 border border-white/10 rounded-2xl text-center space-y-2">
          <span className="text-3xl">🎖️</span>
          <p className="text-xs font-bold uppercase tracking-widest text-[#ddb7ff]">Graduation Horizon</p>
          <p className="text-[11px] text-[#c6c6cc]">Personalized AI roadmap unlocked based on your year selection.</p>
        </div>

      </div>
    </Card>
  );
}
