'use client';
import { memo } from 'react';
import type { LegacyVisualProps } from '../../../types/visual.types';
import { visualGeometry } from '../../../utilities/structuredVisual';
import {
  CONCEPTUAL_COLORS as colors, STRUCTURED_COLORS as palette, STRUCTURED_LABELS, STRUCTURED_LAYOUT as layout,
} from '../../../constants/conceptualVisualConstants';

const { tick, tree, fontSize } = layout;

export const StructuredVisual = memo(function StructuredVisual({ visual }: LegacyVisualProps) {
  const geometry = visualGeometry(visual);
  const yAxisX = geometry.axisX ?? layout.plot.left;
  return <svg data-lecture-svg viewBox={`0 0 ${layout.width} ${layout.height}`} className="w-full h-full" role="img" aria-label={STRUCTURED_LABELS[visual.kind]}>
    {visual.kind === 'polynomial' ? <><path d={geometry.axisPath} stroke={palette.axis} fill="none" /><path d={geometry.path} stroke={palette.curve} strokeWidth="3" fill="none" />
      {geometry.xTicks.map(item => <g key={`x${item.value}`} data-axis-tick="x"><path d={`M${item.position},${geometry.axisY - tick.halfLength} V${geometry.axisY + tick.halfLength}`} stroke={colors.support} /><text x={item.position} y={Math.min(geometry.axisY + tick.xLabelOffset, tick.xLabelMaxY)} textAnchor="middle" fontSize={fontSize} fill={colors.support}>{item.value}</text></g>)}
      {geometry.yTicks.map(item => <g key={`y${item.value}`} data-axis-tick="y"><path d={`M${yAxisX - tick.halfLength},${item.position} H${yAxisX + tick.halfLength}`} stroke={colors.support} /><text x={yAxisX - tick.yLabelOffset} y={item.position + tick.yLabelBaseline} textAnchor="end" fontSize={fontSize} fill={colors.support}>{item.value}</text></g>)}
      <text x={layout.rangeLabel.x} y={layout.rangeLabel.y} fontSize={fontSize} fill={colors.support}>x: {visual.x_min} to {visual.x_max}; coefficients: {visual.coefficients.join(', ')}</text></> : <>
    {geometry.edges.map(edge => <line key={`edge-${edge.id}`} x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2} stroke={palette.axis} />)}
    {geometry.nodes.map(n => <g key={n.id}><circle cx={n.x} cy={n.y} r={tree.nodeRadius} fill={palette.nodeFill} stroke={palette.curve} /><text x={n.x} y={n.y + tree.labelBaseline} textAnchor="middle" fill={palette.nodeText} fontSize={fontSize}>{n.label}</text></g>)}
    </>}
  </svg>;
});
StructuredVisual.displayName = 'StructuredVisual';
