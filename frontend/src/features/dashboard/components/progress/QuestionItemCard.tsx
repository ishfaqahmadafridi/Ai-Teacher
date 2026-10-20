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
          ? 'bg-dashboard-panel border-dashboard-border hover:border-dashboard-primary/40'
          : 'bg-dashboard-warning/5 border-dashboard-warning/30 hover:border-dashboard-warning/60'
      } ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-dashboard-subtle text-dashboard-muted border border-dashboard-border">
            {question.className}
          </span>
          <span className="text-[11px] text-dashboard-muted font-mono">
            {question.timestampFormatted}
          </span>
        </div>

        {/* Relevance Badge */}
        {isRelevant ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-dashboard-success/5 text-dashboard-success font-bold text-[10px] uppercase border border-dashboard-success/30 shrink-0">
            <CheckCircle2 className="w-3 h-3" />
            Topic Relevant
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-dashboard-warning/5 text-dashboard-warning font-bold text-[10px] uppercase border border-dashboard-warning/30 shrink-0">
            <AlertOctagon className="w-3 h-3" />
            Off-Topic / Distraction
          </span>
        )}
      </div>

      <div>
        <h5 className="font-['Hanken_Grotesk',sans-serif] text-sm font-semibold text-dashboard-text flex items-start gap-2">
          <HelpCircle className="w-4 h-4 text-dashboard-primary shrink-0 mt-0.5" />
          <span>&ldquo;{question.questionText}&rdquo;</span>
        </h5>
        <div className="text-[11px] text-dashboard-muted mt-1 pl-6">
          Topic: <span className="text-dashboard-muted font-medium">{question.topicName}</span>
        </div>
      </div>

      {question.teacherResponse && (
        <div className="pl-4 border-l-2 border-dashboard-primary/40 pt-1 text-xs text-dashboard-muted italic bg-dashboard-panel/50 p-2.5 rounded-r-xl">
          <span className="font-bold text-dashboard-primary not-italic">Teacher Response: </span>
          {question.teacherResponse}
        </div>
      )}
    </div>
  );
});

QuestionItemCard.displayName = 'QuestionItemCard';
