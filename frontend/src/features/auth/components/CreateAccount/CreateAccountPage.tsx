'use client';

import { LiveDotsBackground } from '../Login/LiveDotsBackground';
import { HeroPanel } from '../Login/HeroPanel';
import { GlassCard } from './GlassCard';
import { AuthHeader } from './AuthHeader';
import { CreateAccountForm } from './CreateAccountForm';

export function CreateAccountPage() {
  return (
    <div className="bg-[#10131a] text-[#e1e2eb] min-h-screen w-screen overflow-x-hidden flex font-['Inter',sans-serif] relative">
      <div className="flex w-full min-h-screen relative z-10">
        {/* Left Registration Form Panel */}
        <div className="w-full lg:w-1/2 lg:min-w-[50%] lg:max-w-[50%] flex items-center justify-center p-4 sm:p-8 z-10 relative min-h-screen overflow-y-auto py-8">
          <LiveDotsBackground />
          <GlassCard>
            <AuthHeader
              title="Create Account"
              subtitle="Begin your high-tech gateway to the future of learning."
            />
            <CreateAccountForm />
          </GlassCard>
        </div>

        {/* Right Hero Panel with AI Mentor background */}
        <HeroPanel
          imageSrc="/ai-mentor-bg.png"
          imageAlt="AI Teacher interactive mentor learning scene"
        />
      </div>
    </div>
  );
}
