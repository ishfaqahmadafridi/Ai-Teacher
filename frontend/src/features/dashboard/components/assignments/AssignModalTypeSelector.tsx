'use client';

import { memo } from 'react';
import { FileText, HelpCircle } from 'lucide-react';
import type { AssignModalTypeSelectorProps } from '../../types/assignments.types';

export const AssignModalTypeSelector = memo(function AssignModalTypeSelector({
  type,
  onTypeChange,
  className = '',
}: AssignModalTypeSelectorProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
        Work Type
      </label>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onTypeChange('assignment')}
          className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
            type === 'assignment'
              ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-lg'
              : 'bg-[#090D16] text-[#94A3B8] border-[#1E293B] hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Assignment (File/Text)</span>
        </button>

        <button
          type="button"
          onClick={() => onTypeChange('quiz')}
          className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
            type === 'quiz'
              ? 'bg-[#8B5CF6] text-white border-[#8B5CF6] shadow-lg'
              : 'bg-[#090D16] text-[#94A3B8] border-[#1E293B] hover:text-white'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Interactive Quiz</span>
        </button>
      </div>
    </div>
  );
});

AssignModalTypeSelector.displayName = 'AssignModalTypeSelector';
