import { STRUCTURED_LAYOUT as layout } from '../constants/conceptualVisualConstants';
import type { TreeVisual, PolynomialVisual } from '../types/visual.types';

/** Round tick values (1, 2 or 5 × 10ⁿ) so students can read where the graph crosses an axis. */
export function axisTicks(min: number, max: number, target = 8): number[] {
  const span = max - min;
  if (!Number.isFinite(span) || span <= 0) return [];
  const raw = span / target, magnitude = 10 ** Math.floor(Math.log10(raw)), scaled = raw / magnitude;
  const step = (scaled <= 1 ? 1 : scaled <= 2 ? 2 : scaled <= 5 ? 5 : 10) * magnitude;
  const values: number[] = [];
  for (let value = Math.ceil(min / step) * step; value <= max + step * 1e-9; value += step) values.push(Number(value.toFixed(10)) || 0);
  return values;
}

function polynomialGeometry(visual: PolynomialVisual) {
  const { left, right, top, bottom, samples } = layout.plot;
  const width = right - left, height = bottom - top, last = samples - 1, step = width / last;
  const points = Array.from({ length: samples }, (_, i) => {
    const x = visual.x_min + (visual.x_max - visual.x_min) * i / last;
    return { x, y: visual.coefficients.reduceRight((sum, coefficient) => sum * x + coefficient, 0) };
  });
  const low = Math.min(0, ...points.map(p => p.y));
  const high = Math.max(0, ...points.map(p => p.y));
  const scaleY = (y: number) => bottom - (y - low) / (high - low || 1) * height;
  const scaleX = (x: number) => left + (x - visual.x_min) / (visual.x_max - visual.x_min) * width;
  const axisY = scaleY(0);
  const axisX = visual.x_min <= 0 && visual.x_max >= 0 ? scaleX(0) : null;
  return {
    path: points.map((p, i) => `${i ? 'L' : 'M'}${left + i * step},${scaleY(p.y)}`).join(' '),
    axisPath: `M${left},${axisY} H${right} ${axisX === null ? '' : `M${axisX},${top} V${bottom}`}`,
    axisY, axisX, nodes: [], edges: [],
    xTicks: axisTicks(visual.x_min, visual.x_max).map(value => ({ value, position: scaleX(value) })),
    // Zero is already marked by the x axis itself, so it gets no y label.
    yTicks: axisTicks(low, high).filter(value => value !== 0).map(value => ({ value, position: scaleY(value) })),
  };
}

function treeGeometry(visual: TreeVisual) {
  const byId = new Map(visual.nodes.map(node => [node.id, node]));
  const depth = (id: string): number => {
    let current = byId.get(id); let result = 0;
    const seen = new Set<string>();
    while (current?.parent && !seen.has(current.id)) { seen.add(current.id); result++; current = byId.get(current.parent); }
    return result;
  };
  const levels = new Map(visual.nodes.map(node => [node.id, depth(node.id)]));
  const maxDepth = Math.max(1, ...levels.values());
  const nodes = visual.nodes.map(node => {
    const level = levels.get(node.id) ?? 0, peers = visual.nodes.filter(peer => levels.get(peer.id) === level);
    return { ...node, x: layout.width * (peers.findIndex(peer => peer.id === node.id) + 1) / (peers.length + 1),
      y: layout.tree.top + level / maxDepth * layout.tree.height };
  });
  const placed = new Map(nodes.map(node => [node.id, node]));
  const edges = nodes.flatMap(node => {
    const parent = node.parent ? placed.get(node.parent) : undefined;
    return parent ? [{ id: node.id, x1: parent.x, y1: parent.y, x2: node.x, y2: node.y }] : [];
  });
  return { path: '', axisPath: '', axisY: 0, axisX: null, nodes, edges, xTicks: [], yTicks: [] };
}

export function visualGeometry(visual: TreeVisual | PolynomialVisual) {
  return visual.kind === 'polynomial' ? polynomialGeometry(visual) : treeGeometry(visual);
}
