'use client';

import Image from 'next/image';
import { Card } from "@/components/ui/card";

interface AIMentorBannerCardProps {
  fullName?: string;
}

export function AIMentorBannerCard({ fullName }: AIMentorBannerCardProps) {
  return (
    <Card className="lg:col-span-5 relative order-1 lg:order-2 flex flex-col justify-center items-center lg:items-start min-h-[340px] rounded-3xl overflow-hidden border-white/10 shadow-2xl bg-transparent">
      <Image
        src="/ai-mentor-bg.png"
        alt="AI Mentor Background"
        fill
        sizes="(max-width: 1024px) 100vw, 40vw"
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1D] via-[#0A0F1D]/40 to-transparent" />
      <div className="relative z-10 p-8 glass-card rounded-3xl m-4 backdrop-blur-xl bg-black/40 border border-white/10">
        <h1 className="text-3xl font-bold mb-2 text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Hello, <span className="text-[#b8c3ff]">{fullName || 'Student'}</span>!
        </h1>
        <p className="text-[#c6c6cc] text-sm leading-relaxed">
          Your AI mentor is ready to personalize your journey based on these details.
        </p>
      </div>
    </Card>
  );
}
