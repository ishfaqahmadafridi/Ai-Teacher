'use client';

import { memo } from 'react';
import { usePrinciplesNotesPane } from '../../hooks/usePrinciplesNotesPane';
import { PaneHeader } from './PaneHeader';
import { EquationCard } from './EquationCard';
import { PrinciplesList } from './PrinciplesList';
import type { PrinciplesNotesPaneProps } from './board.types';

export const PrinciplesNotesPane = memo(function PrinciplesNotesPane({
  title,
  principles,
  formula,
  formulaLabel,
  className = '',
}: PrinciplesNotesPaneProps) {
  const {
    title: activeTitle,
    principles: activePrinciples,
    formulaLabel: activeFormulaLabel,
    activeFormula,
  } = usePrinciplesNotesPane({ title, principles, formula, formulaLabel });

  return (
    <div className={`w-full lg:w-1/2 h-full p-6 md:p-8 relative flex flex-col bg-[#111318]/20 ${className}`}>
      {/* Pane Header Component */}
      <PaneHeader title={activeTitle} />

      {/* Content Scroll Container */}
      <div className="flex-1 space-y-6 overflow-y-auto pr-1">
        {/* Dynamic Equation Card Component */}
        <EquationCard label={activeFormulaLabel} formula={activeFormula} />

        {/* Principles List Component */}
        <PrinciplesList principles={activePrinciples} />
      </div>
    </div>
  );
});

PrinciplesNotesPane.displayName = 'PrinciplesNotesPane';
