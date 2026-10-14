import type { DiagramCommand } from '../types/classroom.types';
export function visualGeometry(visual: NonNullable<DiagramCommand['visual']>) {
  if (visual.kind === 'polynomial') {
    const points = Array.from({ length: 101 }, (_, i) => {
      const x = visual.x_min + (visual.x_max - visual.x_min) * i / 100;
      const y = visual.coefficients.reduceRight((sum, coefficient) => sum * x + coefficient, 0);
      return { x, y };
    });
    const low = Math.min(0, ...points.map(p => p.y));
    const high = Math.max(0, ...points.map(p => p.y));
    const scaleY = (y: number) => 340 - (y - low) / (high - low || 1) * 300;
    return { path: points.map((p, i) => `${i ? 'L' : 'M'}${40 + i * 5.2},${scaleY(p.y)}`).join(' '), axisY: scaleY(0), axisX: visual.x_min <= 0 && visual.x_max >= 0 ? 40 + (0 - visual.x_min) / (visual.x_max - visual.x_min) * 520 : null, nodes: [] };
  }
  const depth = (id: string): number => {
    let current = visual.nodes.find(n => n.id === id); let result = 0;
    const seen = new Set<string>();
    while (current?.parent && !seen.has(current.id)) { seen.add(current.id); result++; current = visual.nodes.find(n => n.id === current?.parent); }
    return result;
  };
  const maxDepth = Math.max(1, ...visual.nodes.map(n => depth(n.id)));
  const nodes = visual.nodes.map(n => {
    const level = depth(n.id), peers = visual.nodes.filter(p => depth(p.id) === level);
    return { ...n, x: 600 * (peers.findIndex(p => p.id === n.id) + 1) / (peers.length + 1), y: 40 + level / maxDepth * 280 };
  });
  return { path: '', axisY: 0, axisX: null, nodes };
}
