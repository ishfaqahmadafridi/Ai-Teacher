'use client';

import { memo } from 'react';
import { HelpCircle, CheckCircle2, AlertOctagon } from 'lucide-react';
import type { QuestionItemCardProps } from '../../types/progress.types';

export const QuestionItemCard = memo(function QuestionItemCard({
  question,
  className = '',
}: QuestionItemCardProps) {
  const isRelevant = question.isRelevant;

  return (
    <div
      className={`p-4 rounded-2xl border transition-all duration-200 space-y-3 ${
        isRelevant
          ? 'bg-[#090D16] border-[#1E293B] hover:border-[#38BDF8]/40'
          : 'bg-[#1F1315]/40 border-[#EF4444]/30 hover:border-[#EF4444]/60'
      } ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#1E293B] text-[#94A3B8] border border-[#334155]">
            {question.className}
          </span>
          <span className="text-[11px] text-[#64748B] font-mono">
            {question.timestampFormatted}
          </span>
        </div>

        {/* Relevance Badge */}
        {isRelevant ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] font-bold text-[10px] uppercase border border-[#10B981]/30 shrink-0">
            <CheckCircle2 className="w-3 h-3" />
            Topic Relevant
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EF4444]/20 text-[#EF4444] font-bold text-[10px] uppercase border border-[#EF4444]/30 shrink-0">
            <AlertOctagon className="w-3 h-3" />
            Off-Topic / Distraction
          </span>
        )}
      </div>

      <div>
        <h5 className="font-['Hanken_Grotesk',sans-serif] text-sm font-semibold text-white flex items-start gap-2">
          <HelpCircle className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
          <span>&ldquo;{question.questionText}&rdquo;</span>
        </h5>
        <div className="text-[11px] text-[#64748B] mt-1 pl-6">
          Topic: <span className="text-[#94A3B8] font-medium">{question.topicName}</span>
        </div>
      </div>

      {question.teacherResponse && (
        <div className="pl-4 border-l-2 border-[#2563EB]/40 pt-1 text-xs text-[#94A3B8] italic bg-[#0F172A]/50 p-2.5 rounded-r-xl">
          <span className="font-bold text-[#38BDF8] not-italic">Teacher Response: </span>
          {question.teacherResponse}
        </div>
      )}
    </div>
  );
});

QuestionItemCard.displayName = 'QuestionItemCard';
