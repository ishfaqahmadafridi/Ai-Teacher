import { FORMULA_OPERATORS, FORMULA_GROUPS, FORMULA_VARIABLE_COLORS, FORMULA_TOKEN_STYLES } from '../constants/formulaConstants';
import type { FormulaToken } from '../types/board.types';

/** Parse formula tokens and their presentation metadata without creating React elements. */
export function tokenizeFormula(formula: string): FormulaToken[] {
  if (!formula || typeof formula !== 'string') return [];
  return formula.split(/([=+\-*/^() ,])/g).map(text => {
    let className = '';
    if (FORMULA_OPERATORS.includes(text)) className = FORMULA_TOKEN_STYLES.operator;
    else if (FORMULA_GROUPS.includes(text)) className = FORMULA_TOKEN_STYLES.group;
    else if (/^[a-zA-Z]$/.test(text)) className = `font-semibold ${FORMULA_VARIABLE_COLORS[text.charCodeAt(0) % FORMULA_VARIABLE_COLORS.length]}`;
    else if (/^[a-zA-Z]{2,}$/.test(text)) className = FORMULA_TOKEN_STYLES.word;
    else if (/^[0-9]+(\.[0-9]+)?$/.test(text)) className = FORMULA_TOKEN_STYLES.number;
    return { text, className };
  });
}
