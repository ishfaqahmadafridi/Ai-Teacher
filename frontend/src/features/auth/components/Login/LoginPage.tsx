'use client';

import { LoginFormPanel } from './LoginFormPanel';
import { HeroPanel } from './HeroPanel';

export function LoginPage() {
  return (
    <div className="bg-[#10131a] text-[#e1e2eb] min-h-screen w-screen overflow-x-hidden flex font-['Inter',sans-serif] relative">
      <div className="flex w-full min-h-screen relative z-10">
        <LoginFormPanel />
        <HeroPanel />
      </div>
    </div>
  );
}
