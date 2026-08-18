'use client';

import { memo } from 'react';
import { BookOpen } from 'lucide-react';
import { FieldSelectCombobox } from '../FieldSelectCombobox';
import type { PrimaryDisciplineCardProps } from '../../../types/settings.types';

export const PrimaryDisciplineCard = memo(function PrimaryDisciplineCard({
  primaryField,
  onChangeField,
  className = '',
}: PrimaryDisciplineCardProps) {
  return (
    <div className={`p-4 rounded-2xl bg-[#090D16] border border-[#1E293B] space-y-3 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#C4B5FD] shrink-0">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">Primary Discipline & Major</h4>
          <p className="text-xs text-[#94A3B8]">
            Type your custom major or select from presets below.
          </p>
        </div>
      </div>

      <FieldSelectCombobox
        value={primaryField}
        onChange={onChangeField}
      />
    </div>
  );
});

PrimaryDisciplineCard.displayName = 'PrimaryDisciplineCard';
