'use client';
import { useMemo, useState } from 'react';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { cn } from '@/lib/utils';
import {
  ANATOMY_ATTRIBUTION, ANATOMY_CAPTION_SEPARATOR, ANATOMY_FALLBACK, ANATOMY_MISSING_TEXT, ANATOMY_MODELS,
} from '../constants/anatomyVisualConstants';
import { anatomyFallbackPosition } from '../utilities/anatomyParts';
import { useAnatomyAsset } from './useAnatomyAsset';
import type { AnatomyVisual, AnatomyViewMode, SchematicVisual } from '../types/visual.types';

export function useAnatomyVisual(visual: AnatomyVisual) {
  const [webGLAvailable] = useState(() => WebGL.isWebGL2Available());
  const entry = ANATOMY_MODELS[visual.model];
  const assetStatus = useAnatomyAsset(entry.asset);
  const partIds = useMemo(() => entry.parts.map(part => part.id), [entry]);
  // Labelled 2D fallback keeps the lesson usable when WebGL or the model file is unavailable.
  const fallback = useMemo<SchematicVisual>(() => ({
    kind: 'schematic', title: `${entry.title} ${ANATOMY_FALLBACK.titleSuffix}`,
    nodes: entry.parts.map((part, index) => ({
      id: part.id, label: part.label, ...anatomyFallbackPosition(index, ANATOMY_FALLBACK.columns, ANATOMY_FALLBACK.spacing),
    })),
    edges: [], focus: visual.focus,
  }), [entry, visual.focus]);

  let mode: AnatomyViewMode = 'fallback';
  if (assetStatus === 'checking') mode = 'checking';
  else if (webGLAvailable && assetStatus === 'ready') mode = 'model';

  const caption = [entry.title, assetStatus === 'missing' ? ANATOMY_MISSING_TEXT : ANATOMY_ATTRIBUTION].join(ANATOMY_CAPTION_SEPARATOR);
  const partClassName = (partId: string) => cn('rounded bg-dashboard-panel/90 px-2 py-1',
    visual.focus === partId ? 'font-bold text-dashboard-primary' : 'text-dashboard-muted');

  return { entry, partIds, fallback, mode, caption, partClassName };
}
