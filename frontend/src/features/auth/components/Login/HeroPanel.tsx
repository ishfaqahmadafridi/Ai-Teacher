'use client';

import Image from 'next/image';
import type { HeroPanelProps } from '../../types';

export function HeroPanel({
  imageSrc = '/ai-tutor-scene.jpg',
  imageAlt = 'Young adult student studying online with AI Teacher',
  className = '',
}: HeroPanelProps) {
  return (
    <div className={`hidden lg:block w-1/2 relative min-h-screen overflow-hidden ${className}`}>
      {/* Dark tint overlay */}
      <div className="absolute inset-0 bg-[#10131a]/20 z-10 pointer-events-none" />
      
      {/* Hero background scene */}
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        sizes="50vw"
        priority
        className="object-cover w-full h-full z-0 relative"
      />
      
      {/* Edge gradient transition blending into left form split */}
      <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-[#10131a] via-[#10131a]/80 to-transparent z-20 pointer-events-none" />
    </div>
  );
}
