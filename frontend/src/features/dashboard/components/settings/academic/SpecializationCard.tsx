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
    <div className={`p-4 rounded-2xl bg-[#090D16] border border-[#1E293B] space-y-3 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] shrink-0">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">Specialization & Research Focus</h4>
          <p className="text-xs text-[#94A3B8]">
            Specific subfield or concentration (e.g. Artificial Intelligence, Quantum Mechanics).
          </p>
        </div>
      </div>

      <input
        type="text"
        value={specialization || ''}
        onChange={(e) => onChangeSpecialization(e.target.value)}
        placeholder="e.g. Artificial Intelligence & Machine Learning"
        className="w-full bg-[#070D1A] border border-[#1E293B] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#38BDF8]"
      />
    </div>
  );
});

SpecializationCard.displayName = 'SpecializationCard';
