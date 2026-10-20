'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function HomeChatTeaser() {

  return (
    <section 
      className="w-full max-w-[1100px] mx-auto mt-4 p-6 md:p-10 rounded-3xl border border-dashboard-border relative overflow-hidden bg-dashboard-panel"
    >
      <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
        
        {/* Left Side: Content & Action */}
        <div className="flex-1 text-left max-w-[540px]">
          <span 
            className="text-xs font-semibold tracking-widest uppercase text-dashboard-primary mb-3 block"
            style={{ letterSpacing: '0.12em' }}
          >
            24/7 Companion
          </span>
          <h3 
            className="text-3xl md:text-4xl font-semibold text-dashboard-text mb-4 tracking-tight"
            style={{ fontFamily: 'var(--font-display-lg), var(--font-outfit), sans-serif' }}
          >
            AI Chat Assistant
          </h3>
          <p className="text-[15px] leading-relaxed text-dashboard-muted mb-8">
            Work through a difficult concept, review your code, or solve a problem step by step.
            Your AI tutor helps you understand the reasoning and keep learning at your own pace.
          </p>
          
          {/* Start Button */}
          <Link href="/ask" className="inline-flex items-center justify-center gap-2 rounded-xl bg-dashboard-primary px-5 py-3 text-sm font-semibold text-white hover:bg-dashboard-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dashboard-primary no-underline transition-colors">
            Start chatting <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>

        {/* Right Side: Image Showcase */}
        <div className="flex-1 w-full flex justify-center items-center">
          <div 
            className="relative w-full max-w-[460px] aspect-[16/9] rounded-2xl overflow-hidden border border-dashboard-border"
          >
            <Image
              src="/ai-chat-scene.jpg"
              alt="AI Chat Assistant Demonstration"
              fill
              sizes="(max-width: 768px) 100vw, 460px"
              className="object-cover"
              priority
            />
          </div>
        </div>

      </div>
    </section>
  );
}

export default HomeChatTeaser;
