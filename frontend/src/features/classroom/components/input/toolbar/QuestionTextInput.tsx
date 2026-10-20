'use client';

import { memo } from 'react';
import type { QuestionTextInputProps } from '../../../types/input.types';

export const QuestionTextInput = memo(function QuestionTextInput({
  topic,
  inputText,
  onChange,
  onKeyDown,
  disabled,
  className = '',
}: QuestionTextInputProps) {
  return (
    <div className={`flex-1 min-w-0 flex items-center ${className}`}>
      <textarea
        id="question-input"
        rows={1}
        placeholder={`Ask a question about ${topic || 'this topic'}…`}
        aria-label="Question for the AI teacher"
        value={inputText}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={disabled}
        className="w-full bg-transparent text-sm text-dashboard-text placeholder:text-dashboard-muted border-0 rounded-none shadow-none resize-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-0 disabled:opacity-70 font-sans leading-relaxed pt-0.5"
      />
    </div>
  );
});

QuestionTextInput.displayName = 'QuestionTextInput';
