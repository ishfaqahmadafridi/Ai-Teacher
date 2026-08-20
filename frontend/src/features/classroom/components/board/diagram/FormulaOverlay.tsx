'use client';

import { memo } from 'react';
import { FormulaBlock } from '@/shared/components/FormulaBlock';
import type { FormulaOverlayProps } from '../../../types/board.types';

export const FormulaOverlay = memo(function FormulaOverlay({ command, formula }: FormulaOverlayProps) {
  if (!formula && (!command || command.action !== 'show_formula')) return null;
  
  const displayFormula = formula || command?.formula;
  if (!displayFormula) return null;

  return (
    <div className="absolute top-4 right-4 z-10 max-w-sm pointer-events-auto">
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-xl px-4 py-2.5 shadow-lg flex flex-col gap-1">
        <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
          📝 Key Formula
        </span>
        <div className="text-white text-base font-mono">
          <FormulaBlock>{`$$${displayFormula}$$`}</FormulaBlock>
        </div>
      </div>
    </div>
  );
});

FormulaOverlay.displayName = 'FormulaOverlay';
