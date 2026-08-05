'use client';

import { memo, useMemo } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { DEFAULT_QUESTION_PLACEHOLDER } from '../../constants/inputConstants';
import { createEnterKeyHandler } from '../../utilities/keyboardUtils';
import type { QuestionInputFieldProps } from '../../types/input.types';

export const QuestionInputField = memo(function QuestionInputField({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  disabled = false,
  placeholder = DEFAULT_QUESTION_PLACEHOLDER,
  className = '',
}: QuestionInputFieldProps) {
  const handleKeyDown = useMemo(() => createEnterKeyHandler(onSubmit), [onSubmit]);

  return (
    <div className={`relative w-64 sm:w-80 md:w-[380px] lg:w-[460px] mx-1 md:mx-2 ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled || isLoading}
        placeholder={placeholder}
        aria-label="Ask Question"
        className="w-full bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/15 focus:border-[#2e5bff]/60 rounded-full pl-4 pr-10 py-2 text-xs md:text-sm text-[#e2e2e8] placeholder-[#c4c5d9]/60 outline-none transition-all duration-300 shadow-inner disabled:opacity-50"
      />
      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled || isLoading || !value.trim()}
        aria-label="Send Question"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#2e5bff] hover:bg-[#4671ff] disabled:bg-[#333539] text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin text-white" aria-hidden="true" />
        ) : (
          <Send className="w-3.5 h-3.5 md:w-4 md:h-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
});

QuestionInputField.displayName = 'QuestionInputField';
