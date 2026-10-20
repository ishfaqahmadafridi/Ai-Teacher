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
          ? 'bg-dashboard-selected border-violet-500/70 shadow-sm text-dashboard-text scale-[1.02] border-l-4 border-l-violet-400'
          : isCompleted
          ? 'bg-dashboard-subtle border-emerald-500/30 hover:border-emerald-500/50 cursor-pointer text-dashboard-text'
          : topic.isDisabled
          ? 'bg-dashboard-subtle border-dashboard-border opacity-40 cursor-not-allowed'
          : 'bg-dashboard-panel border-dashboard-border hover:border-dashboard-primary/30 hover:bg-dashboard-selected cursor-pointer text-dashboard-muted'
      } ${className}`}
    >
      {/* Subtle Ambient Glow for Active Topic */}
      {isActive && (
        <div className="absolute top-0 right-0 w-32 h-full bg-violet-500/10 blur-xl pointer-events-none" />
      )}

      <div className="flex items-center gap-3 min-w-0 relative z-10">
        {/* Icon / Step Badge */}
        {isCompleted ? (
          <div className="p-1 rounded-full bg-emerald-500/20 text-dashboard-success border border-emerald-500/40 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        ) : topic.isLive ? (
          <div className="p-1 rounded-full bg-violet-500/25 text-dashboard-primary border border-violet-500/50 shrink-0 animate-pulse">
            <Radio className="w-4 h-4 text-dashboard-primary" />
          </div>
        ) : topic.isDisabled ? (
          <div className="p-1 rounded-full bg-dashboard-subtle text-dashboard-muted shrink-0">
            <Lock className="w-4 h-4" />
          </div>
        ) : (
          <span className="w-6 h-6 rounded-xl bg-dashboard-subtle border border-dashboard-border flex items-center justify-center text-[10px] font-mono font-bold text-dashboard-muted shrink-0 group-hover:border-slate-600 group-hover:text-dashboard-primary transition-colors">
            {index + 1}
          </span>
        )}

        {/* Topic Title */}
        <span className="text-xs font-bold truncate leading-snug font-['Hanken_Grotesk',sans-serif] group-hover:text-dashboard-primary transition-colors">
          {topic.title}
        </span>
      </div>

      {/* Status Badge / Arrow */}
      {topic.isLive ? (
        <span className="text-[9px] font-mono font-extrabold uppercase tracking-wider text-dashboard-success bg-emerald-500/15 px-2.5 py-1 rounded-lg border border-emerald-400/30 shrink-0 shadow-sm shadow-emerald-500/20 relative z-10 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          Live
        </span>
      ) : isCompleted ? (
        <span className="text-[10px] font-mono text-dashboard-success/80 shrink-0 font-medium">
          Done
        </span>
      ) : (
        <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-dashboard-muted group-hover:translate-x-0.5 transition-all shrink-0" />
      )}
    </div>
  );
});

OutlineTopicCard.displayName = 'OutlineTopicCard';
