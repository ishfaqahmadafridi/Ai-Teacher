'use client';
import { memo, Suspense } from 'react';
import { Text } from '@react-three/drei';
import { DIAGRAM_LABEL_FONT } from '../../../constants/diagramConstants';
import type { DiagramLabelProps } from '../../../types/board.types';

/**
 * 3D text suspends while its font is typeset. Its own boundary lets the diagram's shapes
 * render immediately instead of the whole scene waiting behind a spinner.
 */
export const DiagramLabel = memo(function DiagramLabel(props: DiagramLabelProps) {
  return <Suspense fallback={null}><Text font={DIAGRAM_LABEL_FONT} {...props} /></Suspense>;
});
DiagramLabel.displayName = 'DiagramLabel';
