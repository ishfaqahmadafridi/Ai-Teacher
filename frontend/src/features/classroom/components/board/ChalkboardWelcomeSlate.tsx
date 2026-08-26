'use client';

import { memo } from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { SAMPLE_PHYSICS_PROMPTS } from '../../constants/boardConstants';
import type { ChalkboardWelcomeSlateProps } from '../../types/board.types';

export const ChalkboardWelcomeSlate = memo(function ChalkboardWelcomeSlate({
  onSelectSamplePrompt,
  className = '',
}: ChalkboardWelcomeSlateProps) {
  return (
    <div
      className={`relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center select-none overflow-y-auto ${className}`}
    >
      {/* Glowing Chalk Badge Icon */}
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/10 animate-bounce">
        <span className="text-3xl">🎓</span>
      </div>

      {/* Chalk Title */}
      <h2 className="text-2xl sm:text-3xl font-bold font-mono text-white/90 tracking-wide drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] mb-2">
        Welcome to Prof. Gemini&apos;s Physics Lab
      </h2>

      <p className="text-slate-300/80 text-sm max-w-md font-sans mb-6 leading-relaxed">
        Ask any physics question below or select a topic to draw real-time chalk notes & 3D simulations on the board.
      </p>

      {/* Sample Prompts Header */}
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="w-4 h-4 text-yellow-300/90" />
        <span className="text-xs font-mono font-bold text-yellow-200/90 tracking-wider uppercase">
          Sample Physics Topics
        </span>
      </div>

      {/* 4 Interactive Sample Prompt Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-2xl w-full">
        {SAMPLE_PHYSICS_PROMPTS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectSamplePrompt(item.prompt)}
            className="p-3 rounded-xl bg-white/5 hover:bg-emerald-500/15 border border-white/10 hover:border-emerald-400/40 text-left transition-all duration-200 cursor-pointer group flex items-center justify-between shadow-sm active:scale-98"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-lg shrink-0">{item.icon}</span>
              <div className="min-w-0">
                <p className="text-xs font-mono font-bold text-emerald-300 group-hover:text-emerald-200 truncate">
                  {item.topic}
                </p>
                <p className="text-[11px] text-slate-300/70 truncate group-hover:text-white/90">
                  {item.prompt}
                </p>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </button>
        ))}
      </div>
    </div>
  );
});

ChalkboardWelcomeSlate.displayName = 'ChalkboardWelcomeSlate';
