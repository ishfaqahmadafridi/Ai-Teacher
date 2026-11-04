'use client';
import { useId, useMemo } from 'react';
import { SCHEMATIC_BOUNDS as bounds } from '../constants/conceptualVisualConstants';
import type { SchematicVisual } from '../types/visual.types';
import { schematicLayout } from '../utilities/schematicLayout';

export function useSchematicVisual(visual: SchematicVisual) {
  const markerId = useId().replace(/:/g, '');
  const nodes = useMemo(() => schematicLayout(visual), [visual]);
  const edges = useMemo(() => visual.edges.flatMap(edge => {
    const from = nodes.find(node => node.id === edge.source), to = nodes.find(node => node.id === edge.target);
    if (!from || !to) return [];
    const dx = to.px - from.px, dy = to.py - from.py;
    const scale = Math.min(dx ? bounds.nodeWidth / 2 / Math.abs(dx) : Infinity,
      dy ? bounds.nodeHeight / 2 / Math.abs(dy) : Infinity, 0.5);
    return [{ ...edge, x1: from.px + dx * scale, y1: from.py + dy * scale,
      x2: to.px - dx * scale, y2: to.py - dy * scale }];
  }), [nodes, visual.edges]);
  return { markerId, nodes, edges };
}
