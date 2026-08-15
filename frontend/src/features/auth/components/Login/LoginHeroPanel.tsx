'use client';

import { memo } from 'react';
import Image from 'next/image';

export const LoginHeroPanel = memo(function LoginHeroPanel() {
  return (
    <div className="hidden lg:block lg:w-1/2 relative min-h-screen overflow-hidden">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#0d141d]/30 z-10 pointer-events-none" />
      <Image
        src="/ai-tutor-scene.jpg"
        alt="Young adult student studying online with AI Teacher"
        fill
        sizes="50vw"
        priority
        className="object-cover"
      />
      {/* Edge blend */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0d141d] via-[#0d141d]/70 to-transparent z-20 pointer-events-none" />
    </div>
  );
});

LoginHeroPanel.displayName = 'LoginHeroPanel';
