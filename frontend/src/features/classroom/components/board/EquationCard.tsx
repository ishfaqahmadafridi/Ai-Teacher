'use client';

import { memo } from 'react';
import { renderFormattedFormula } from '../../utilities/formulaUtils';
import type { EquationCardProps } from './board.types';

export const EquationCard = memo(function EquationCard({
  label = 'Primary Equation',
  formula = 'F = m * a',
  className = '',
}: EquationCardProps) {
  return (
    <div className={`bg-white/5 border border-white/10 rounded-xl p-5 md:p-6 backdrop-blur-sm shadow-sm ${className}`}>
      <div className="text-[11px] text-[#c4c5d9] uppercase tracking-widest mb-2 font-semibold font-['Hanken_Grotesk',sans-serif]">
        {label}
      </div>
      <div className="text-3xl md:text-4xl font-mono text-[#e2e2e8] flex items-center justify-center py-3.5 bg-[#0c0e12]/60 rounded-lg border border-white/10 shadow-inner px-4 overflow-x-auto">
        {renderFormattedFormula(formula)}
      </div>
    </div>
  );
});

EquationCard.displayName = 'EquationCard';
