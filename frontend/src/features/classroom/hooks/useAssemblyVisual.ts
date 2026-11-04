'use client';
import { useMemo, useState } from 'react';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { conceptualParts } from '../utilities/conceptualGeometry';
import type { AssemblyVisual, SchematicVisual } from '../types/visual.types';

export function useAssemblyVisual(visual: AssemblyVisual) {
  const [webGLAvailable] = useState(() => WebGL.isWebGL2Available());
  const parts = useMemo(() => conceptualParts(visual), [visual]);
  const uniqueParts = useMemo(() => parts.filter((part, index) => parts.findIndex(candidate => candidate.id === part.id) === index), [parts]);
  const fallback = useMemo<SchematicVisual>(() => ({ kind: 'schematic', title: `${visual.model} parts (2D fallback)`,
    nodes: uniqueParts.map((part, index) => ({ id: part.id, label: part.label, x: (index % 3) / 2, y: Math.floor(index / 3) / 2 })), edges: [], focus: visual.focus,
  }), [uniqueParts, visual.model, visual.focus]);
  const focusedLabelPart = parts.find(part => part.id === visual.focus);
  return { parts, uniqueParts, focusedLabelPart, fallback, webGLAvailable };
}
