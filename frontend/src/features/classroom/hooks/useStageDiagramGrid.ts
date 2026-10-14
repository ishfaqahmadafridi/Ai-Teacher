'use client';

import { isImageUrl } from '@/utils/imageUtils';
import { useAppSelector } from '@/hooks/useAppStore';

export function useStageDiagramGrid() {
  const diagramType = useAppSelector((s) => s.classroom.diagramType);
  const currentCommand = useAppSelector((s) => s.classroom.currentCommand);
  const currentFormula = useAppSelector((s) => s.classroom.currentFormula);

  return {
    hasVisual: Boolean(currentCommand?.visual) || currentCommand?.visual_status === 'unavailable' || diagramType !== 'default' || Boolean(currentFormula || currentCommand?.formula) || Boolean(currentCommand?.target?.startsWith('/api/visual-assets/') || currentCommand?.target && isImageUrl(currentCommand.target)),
    diagramType,
    currentCommand,
    currentFormula,
  };
}
