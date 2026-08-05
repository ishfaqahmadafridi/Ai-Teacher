'use client';

import { useAppSelector } from '@/hooks/useAppStore';
import {
  DEFAULT_PRINCIPLES,
  DEFAULT_PRIMARY_EQUATION,
  DEFAULT_EQUATION_LABEL,
  DEFAULT_PRINCIPLES_TITLE,
} from '../constants/boardConstants';
import type { PrincipleItem } from '../components/board/board.types';

export interface UsePrinciplesNotesPaneOptions {
  title?: string;
  principles?: PrincipleItem[];
  formula?: string;
  formulaLabel?: string;
}

export function usePrinciplesNotesPane(options: UsePrinciplesNotesPaneOptions = {}) {
  const storeFormula = useAppSelector((s) => s.classroom.currentFormula);

  const title = options.title || DEFAULT_PRINCIPLES_TITLE;
  const principles = options.principles || DEFAULT_PRINCIPLES;
  const formulaLabel = options.formulaLabel || DEFAULT_EQUATION_LABEL;
  const activeFormula = options.formula || storeFormula || DEFAULT_PRIMARY_EQUATION;

  return {
    title,
    principles,
    formulaLabel,
    activeFormula,
  };
}
