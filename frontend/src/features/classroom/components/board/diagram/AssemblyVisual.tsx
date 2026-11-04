'use client';
import { memo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { useAssemblyVisual } from '../../../hooks/useAssemblyVisual';
import { ASSEMBLY_VIEW, CONCEPTUAL_MODEL_NOTICE } from '../../../constants/conceptualVisualConstants';
import type { AssemblyVisualProps } from '../../../types/visual.types';
import { AssemblyPart } from './AssemblyPart';
import { SchematicVisual } from './SchematicVisual';

export const AssemblyVisual = memo(function AssemblyVisual({ visual }: AssemblyVisualProps) {
  const { parts, uniqueParts, focusedLabelPart, fallback, webGLAvailable } = useAssemblyVisual(visual);
  return <div className="relative h-full w-full" data-conceptual-model={visual.model}>
    <ErrorBoundary key={visual.model} fallback={<SchematicVisual visual={fallback} />}>
      {webGLAvailable ? <Canvas data-lecture-diagram camera={{ position: ASSEMBLY_VIEW.camera, fov: ASSEMBLY_VIEW.fov }} fallback={<SchematicVisual visual={fallback} />} gl={{ preserveDrawingBuffer: true }}>
        <ambientLight intensity={0.9} /><directionalLight position={ASSEMBLY_VIEW.camera} intensity={1.2} />
        {parts.map((part, index) => <AssemblyPart key={`${part.id}-${index}`} part={part} highlighted={visual.focus === part.id} showLabel={part === focusedLabelPart} />)}
        <OrbitControls enablePan={false} minDistance={ASSEMBLY_VIEW.minDistance} maxDistance={ASSEMBLY_VIEW.maxDistance} />
      </Canvas> : <SchematicVisual visual={fallback} />}
    </ErrorBoundary>
    <p className="absolute left-2 top-2 rounded bg-dashboard-panel/90 px-2 py-1 text-xs text-dashboard-muted">{CONCEPTUAL_MODEL_NOTICE}</p>
    <ul aria-label="Model parts" className="absolute bottom-2 left-2 flex max-w-full flex-wrap gap-1 text-xs">
      {uniqueParts.map(part => <li data-model-part={part.id} key={part.id} className={`rounded bg-dashboard-panel/90 px-2 py-1 ${visual.focus === part.id ? 'font-bold text-dashboard-primary' : 'text-dashboard-muted'}`}>{part.label}</li>)}
    </ul>
  </div>;
});
AssemblyVisual.displayName = 'AssemblyVisual';
