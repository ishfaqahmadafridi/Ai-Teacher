'use client';
import { memo } from 'react';
import dynamic from 'next/dynamic';
import { SchematicVisual } from './SchematicVisual';
import { StructuredVisual } from './StructuredVisual';
import type { LessonVisualProps } from '../../../types/visual.types';

const AssemblyVisual = dynamic(() => import('./AssemblyVisual').then(module => module.AssemblyVisual), { ssr: false });
export const LessonVisual = memo(function LessonVisual({ visual }: LessonVisualProps) {
  if (visual.kind === 'schematic') return <SchematicVisual visual={visual} />;
  if (visual.kind === 'assembly') return <AssemblyVisual visual={visual} />;
  return <StructuredVisual visual={visual} />;
});
LessonVisual.displayName = 'LessonVisual';
