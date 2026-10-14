'use client';
import { memo } from 'react';
import type { DiagramCommand } from '../../../types/classroom.types';
import { visualGeometry } from '../../../utilities/structuredVisual';
export const StructuredVisual = memo(function StructuredVisual({ visual }: { visual: NonNullable<DiagramCommand['visual']> }) {
  const geometry = visualGeometry(visual);
  return <svg data-lecture-svg viewBox="0 0 600 380" className="w-full h-full" role="img" aria-label={visual.kind === 'tree' ? 'Lesson tree diagram' : 'Polynomial graph'}>
    {visual.kind === 'polynomial' ? <><path d={`M40,${geometry.axisY} H560 ${geometry.axisX === null ? "" : `M${geometry.axisX},40 V340`}`} stroke="#94a3b8" fill="none" /><path d={geometry.path} stroke="#38bdf8" strokeWidth="3" fill="none" /><text x="40" y="370" fill="white">x: {visual.x_min} to {visual.x_max}; coefficients: {visual.coefficients.join(', ')}</text></> : <>
    {geometry.nodes.map(n => { const parent = geometry.nodes.find(p => p.id === n.parent); return parent ? <line key={`edge-${n.id}`} x1={parent.x} y1={parent.y} x2={n.x} y2={n.y} stroke="#94a3b8" /> : null; })}
    {geometry.nodes.map(n => <g key={n.id}><circle cx={n.x} cy={n.y} r="22" fill="#0f172a" stroke="#38bdf8" /><text x={n.x} y={n.y + 5} textAnchor="middle" fill="white" fontSize="12">{n.label}</text></g>)}
    </>}
  </svg>;
});
StructuredVisual.displayName = 'StructuredVisual';
