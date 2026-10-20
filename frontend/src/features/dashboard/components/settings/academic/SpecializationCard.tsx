'use client';

import { memo } from 'react';
import { Layers } from 'lucide-react';
import type { SpecializationCardProps } from '../../../types/settings.types';

export const SpecializationCard = memo(function SpecializationCard({
  specialization,
  onChangeSpecialization,
  className = '',
}: SpecializationCardProps) {
  return (
    <div className={`p-4 rounded-2xl bg-dashboard-panel border border-dashboard-border space-y-3 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-dashboard-subtle border border-dashboard-border flex items-center justify-center text-dashboard-muted shrink-0">
          <Layers aria-hidden="true" strokeWidth={1.75} className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-dashboard-text">Specialization & Research Focus</h4>
          <p className="text-xs text-dashboard-muted">
            Specific subfield or concentration (e.g. Artificial Intelligence, Quantum Mechanics).
          </p>
        </div>
      </div>

      <input
        type="text"
        value={specialization || ''}
        onChange={(e) => onChangeSpecialization(e.target.value)}
        placeholder="e.g. Artificial Intelligence & Machine Learning"
        className="w-full bg-dashboard-panel border border-dashboard-border rounded-xl px-4 py-2.5 text-sm text-dashboard-text placeholder:text-dashboard-muted focus:outline-none focus:border-dashboard-primary"
      />
    </div>
  );
});

SpecializationCard.displayName = 'SpecializationCard';
