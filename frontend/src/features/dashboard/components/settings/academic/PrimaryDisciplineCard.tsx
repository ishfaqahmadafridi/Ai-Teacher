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
    <div className={`p-4 rounded-2xl bg-dashboard-panel border border-dashboard-border space-y-3 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-dashboard-subtle border border-dashboard-border flex items-center justify-center text-dashboard-muted shrink-0">
          <BookOpen aria-hidden="true" strokeWidth={1.75} className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-dashboard-text">Primary Discipline & Major</h4>
          <p className="text-xs text-dashboard-muted">
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
