'use client';

import { memo } from 'react';
import type { AskTypingIndicatorProps } from '../../types/ask.types';

export const AskTypingIndicator = memo(function AskTypingIndicator({
  text = 'NeuroLearn is formulating a response...',
  className = '',
}: AskTypingIndicatorProps) {
  return (
    <div className={`flex flex-col items-start gap-2 ${className}`}>
      <div className="flex items-center gap-2 opacity-80 pl-2">
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '100ms' }}></div>
          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <span className="text-xs text-slate-400 italic font-['Hanken_Grotesk',sans-serif]">{text}</span>
      </div>
    </div>
  );
});

AskTypingIndicator.displayName = 'AskTypingIndicator';
