'use client';

import { useAppSelector } from '@/hooks/useAppStore';

export function useStageDiagramGrid() {
  const diagramType = useAppSelector((s) => s.classroom.diagramType);
  const currentCommand = useAppSelector((s) => s.classroom.currentCommand);
  const currentFormula = useAppSelector((s) => s.classroom.currentFormula);

  return {
    diagramType,
    currentCommand,
    currentFormula,
  };
}
