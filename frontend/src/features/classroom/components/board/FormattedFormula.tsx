'use client';
import { memo } from 'react';
import { tokenizeFormula } from '../../utilities/formulaUtils';
import type { FormattedFormulaProps } from '../../types/board.types';

export const FormattedFormula = memo(function FormattedFormula({ formula }: FormattedFormulaProps) {
  return <>{tokenizeFormula(formula).map((token, index) => token.text
    ? <span key={index} className={token.className || undefined}>{token.text}</span>
    : null)}</>;
});
FormattedFormula.displayName = 'FormattedFormula';
