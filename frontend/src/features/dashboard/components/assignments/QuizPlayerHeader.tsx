'use client';

import { memo } from 'react';
import { HelpCircle, X } from 'lucide-react';
import type { QuizPlayerHeaderProps } from '../../types/assignments.types';

export const QuizPlayerHeader = memo(function QuizPlayerHeader({
  title,
  subject,
  points,
  onClose,
  className = '',
}: QuizPlayerHeaderProps) {
  return (
    <div className={`flex items-center justify-between border-b border-dashboard-border pb-4 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-dashboard-primary/20 border border-dashboard-primary/40 text-dashboard-primary flex items-center justify-center">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-['Hanken_Grotesk',sans-serif] text-xl font-bold text-dashboard-text">
            {title}
          </h3>
          <p className="text-xs text-dashboard-muted">
            {subject} • {points} Points Total
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="p-2 rounded-xl bg-dashboard-subtle text-dashboard-muted hover:text-dashboard-text transition-all cursor-pointer"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
});

QuizPlayerHeader.displayName = 'QuizPlayerHeader';
