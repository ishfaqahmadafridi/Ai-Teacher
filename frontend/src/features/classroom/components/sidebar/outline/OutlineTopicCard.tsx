'use client';

import { memo } from 'react';
import { CheckCircle2, Radio, Lock, ArrowRight } from 'lucide-react';
import type { OutlineTopicCardProps } from '../../../types/sidebar.types';

export const OutlineTopicCard = memo(function OutlineTopicCard({
  topic,
  index,
  isActive,
  isCompleted,
  onSelectTopic,
  className = '',
}: OutlineTopicCardProps) {
  return (
    <div
      onClick={() => !topic.isDisabled && onSelectTopic?.(topic.id)}
      className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 group relative overflow-hidden ${
        isActive
          ? 'bg-gradient-to-r from-violet-950/80 via-[#0F172A] to-[#0F172A] border-violet-500/70 shadow-xl shadow-violet-950/60 text-white scale-[1.02] border-l-4 border-l-violet-400'
          : isCompleted
          ? 'bg-[#0F172A]/90 border-emerald-500/30 hover:border-emerald-500/50 cursor-pointer text-slate-200'
          : topic.isDisabled
          ? 'bg-slate-900/30 border-slate-800/40 opacity-40 cursor-not-allowed'
          : 'bg-[#0F172A]/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 cursor-pointer text-slate-300'
      } ${className}`}
    >
      {/* Subtle Ambient Glow for Active Topic */}
      {isActive && (
        <div className="absolute top-0 right-0 w-32 h-full bg-violet-500/10 blur-xl pointer-events-none" />
      )}

      <div className="flex items-center gap-3 min-w-0 relative z-10">
        {/* Icon / Step Badge */}
        {isCompleted ? (
          <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        ) : topic.isLive ? (
          <div className="p-1 rounded-full bg-violet-500/25 text-violet-300 border border-violet-500/50 shrink-0 animate-pulse">
            <Radio className="w-4 h-4 text-violet-400" />
          </div>
        ) : topic.isDisabled ? (
          <div className="p-1 rounded-full bg-slate-800 text-slate-500 shrink-0">
            <Lock className="w-4 h-4" />
          </div>
        ) : (
          <span className="w-6 h-6 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-mono font-bold text-slate-400 shrink-0 group-hover:border-slate-600 group-hover:text-white transition-colors">
            {index + 1}
          </span>
        )}

        {/* Topic Title */}
        <span className="text-xs font-bold truncate leading-snug font-['Hanken_Grotesk',sans-serif] group-hover:text-white transition-colors">
          {topic.title}
        </span>
      </div>

      {/* Status Badge / Arrow */}
      {topic.isLive ? (
        <span className="text-[9px] font-mono font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-lg border border-emerald-400/30 shrink-0 shadow-sm shadow-emerald-500/20 relative z-10 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          Live
        </span>
      ) : isCompleted ? (
        <span className="text-[10px] font-mono text-emerald-400/80 shrink-0 font-medium">
          Done
        </span>
      ) : (
        <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all shrink-0" />
      )}
    </div>
  );
});

OutlineTopicCard.displayName = 'OutlineTopicCard';
