'use client';
import { memo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bounds, Html, OrbitControls } from '@react-three/drei';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { useAnatomyVisual } from '../../../hooks/useAnatomyVisual';
import { ANATOMY_LOADING_TEXT, ANATOMY_PARTS_LABEL, ANATOMY_VIEW } from '../../../constants/anatomyVisualConstants';
import type { AnatomyVisualProps } from '../../../types/visual.types';
import { AnatomyModel } from './AnatomyModel';
import { SchematicVisual } from './SchematicVisual';

export const AnatomyVisual = memo(function AnatomyVisual({ visual }: AnatomyVisualProps) {
  const { entry, partIds, fallback, mode, caption, partClassName } = useAnatomyVisual(visual);
  const fallbackView = <SchematicVisual visual={fallback} />;
  return <div className="relative h-full w-full" data-anatomy-model={visual.model}>
    {/* A missing or corrupt GLB throws inside Suspense; the boundary swaps in the labelled 2D view. */}
    <ErrorBoundary key={visual.model} fallback={fallbackView}>
      {mode === 'checking' && <p role="status" className="p-4 text-xs text-dashboard-muted">{ANATOMY_LOADING_TEXT}</p>}
      {mode === 'fallback' && fallbackView}
      {mode === 'model' && <Canvas data-lecture-diagram camera={{ position: ANATOMY_VIEW.camera, fov: ANATOMY_VIEW.fov }} fallback={fallbackView} gl={{ preserveDrawingBuffer: true }}>
        <ambientLight intensity={ANATOMY_VIEW.ambientIntensity} />
        <directionalLight position={ANATOMY_VIEW.camera} intensity={ANATOMY_VIEW.keyLightIntensity} />
        <Suspense fallback={<Html center><span role="status" className="whitespace-nowrap text-xs text-dashboard-muted">{ANATOMY_LOADING_TEXT}</span></Html>}>
          {/* Bounds refits the camera to any panel shape so tall, narrow layouts never crop the model. */}
          <Bounds fit clip observe margin={ANATOMY_VIEW.margin}>
            <AnatomyModel asset={entry.asset} partIds={partIds} focus={visual.focus} />
          </Bounds>
        </Suspense>
        <OrbitControls makeDefault enablePan={false} minDistance={ANATOMY_VIEW.minDistance} maxDistance={ANATOMY_VIEW.maxDistance} />
      </Canvas>}
    </ErrorBoundary>
    <p className="absolute left-2 top-2 rounded bg-dashboard-panel/90 px-2 py-1 text-xs text-dashboard-muted">{caption}</p>
    <ul aria-label={ANATOMY_PARTS_LABEL} className="absolute bottom-2 left-2 flex max-w-full flex-wrap gap-1 text-xs">
      {entry.parts.map(part => <li data-anatomy-part={part.id} key={part.id} className={partClassName(part.id)}>{part.label}</li>)}
    </ul>
  </div>;
});
AnatomyVisual.displayName = 'AnatomyVisual';
