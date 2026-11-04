'use client';
import { memo } from 'react';
import { useSchematicVisual } from '../../../hooks/useSchematicVisual';
import { SCHEMATIC_BOUNDS as bounds, CONCEPTUAL_COLORS as colors } from '../../../constants/conceptualVisualConstants';
import type { SchematicVisualProps } from '../../../types/visual.types';

export const SchematicVisual = memo(function SchematicVisual({ visual }: SchematicVisualProps) {
  const { markerId, nodes, edges } = useSchematicVisual(visual);
  return <svg data-lecture-svg viewBox={`0 0 ${bounds.width} ${bounds.height}`} className="h-full w-full" role="img" aria-label={visual.title}>
    <title>{visual.title}</title>
    <defs><marker id={markerId} viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10Z" fill={colors.support} /></marker></defs>
    {edges.map(edge => <g key={`${edge.source}-${edge.target}`}><line x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2} stroke={colors.support} strokeWidth="2" markerEnd={`url(#${markerId})`} />
      {edge.label && <text x={(edge.x1 + edge.x2) / 2} y={(edge.y1 + edge.y2) / 2 - 8} textAnchor="middle" fontSize="11" fill={colors.support}>{edge.label}</text>}
    </g>)}
    {nodes.map(node => <g key={node.id} data-visual-part={node.id}>
      <rect x={node.px - bounds.nodeWidth / 2} y={node.py - bounds.nodeHeight / 2} width={bounds.nodeWidth} height={bounds.nodeHeight} rx="8" fill="white" stroke={visual.focus === node.id ? colors.focus : colors.moving} strokeWidth={visual.focus === node.id ? 4 : 2} />
      <text x={node.px} y={node.py + 4} textAnchor="middle" fill={colors.support} fontSize="11"><title>{node.label}</title>{node.label.length > 18 ? `${node.label.slice(0, 17)}…` : node.label}</text>
    </g>)}
  </svg>;
});
SchematicVisual.displayName = 'SchematicVisual';
