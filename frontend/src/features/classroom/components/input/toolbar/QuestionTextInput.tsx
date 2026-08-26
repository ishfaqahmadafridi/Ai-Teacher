'use client';

import { memo } from 'react';
import type { QuestionTextInputProps } from '../../../types/input.types';

export const QuestionTextInput = memo(function QuestionTextInput({
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
        placeholder="Ask Prof. Gemini anything about physics..."
        value={inputText}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={disabled}
        className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 resize-none focus:outline-none disabled:opacity-50 font-sans leading-relaxed pt-0.5"
      />
    </div>
  );
});

QuestionTextInput.displayName = 'QuestionTextInput';
