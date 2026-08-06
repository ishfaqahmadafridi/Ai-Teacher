'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function HomeChatTeaser() {
  const router = useRouter();

  return (
    <section 
      className="w-full max-w-[1100px] mx-auto mt-16 p-8 md:p-12 rounded-[32px] border border-white/5 relative overflow-hidden bg-white/[0.01] backdrop-blur-md"
      style={{
        boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      }}
    >
      {/* Subtle background glow */}
      <div 
        className="absolute -right-10 -bottom-10 w-96 h-96 rounded-full filter blur-3xl opacity-10"
        style={{ background: 'rgba(59, 130, 246, 0.3)' }}
      />
      
      <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
        
        {/* Left Side: Content & Action */}
        <div className="flex-1 text-left max-w-[540px]">
          <span 
            className="text-xs font-semibold tracking-widest uppercase text-blue-400 mb-3 block"
            style={{ letterSpacing: '0.12em' }}
          >
            24/7 Companion
          </span>
          <h3 
            className="text-3xl md:text-4xl font-extrabold text-white mb-6 tracking-tight"
            style={{ fontFamily: 'var(--font-display-lg), var(--font-outfit), sans-serif' }}
          >
            AI Chat Assistant
          </h3>
          <p className="text-[15px] leading-relaxed text-blue-100/60 mb-8">
            Ask questions anytime and receive instant, accurate explanations with step-by-step 
            guidance, code examples, diagrams, and personalized learning support across every 
            subject. Our chat assistant is equipped to handle everything from writing and debugging 
            complex code, solving mathematical equations, clarifying history timelines, to offering 
            immediate feedback to accelerate your learning speed.
          </p>
          
          {/* Start Button */}
          <button
            onClick={() => router.push('/ask')}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] border-none cursor-pointer outline-none active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              fontSize: '14.5px',
            }}
          >
            Start Chatting
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        {/* Right Side: Image Showcase */}
        <div className="flex-1 w-full flex justify-center items-center">
          <div 
            className="relative w-full max-w-[460px] aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(59, 130, 246, 0.15)',
            }}
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
