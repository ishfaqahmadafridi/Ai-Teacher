'use client';

import { useMemo } from 'react';
import type { AnalyticsTrendGraphProps } from '../types/analytics.types';

export function useAnalyticsTrendGraph(trendData: AnalyticsTrendGraphProps['trendData']) {
  // Dynamically calculate (x, y) SVG coordinates for data points
  const points = useMemo(() => {
    if (!trendData || trendData.length === 0) return [];
    const width = 350;
    const height = 100;
    const step = trendData.length > 1 ? width / (trendData.length - 1) : width;
    return trendData.map((d, i) => ({
      day: d.day,
      score: d.score,
      x: i * step,
      y: Math.max(10, Math.min(90, height - d.score)),
    }));
  }, [trendData]);

  // Dynamically build smooth bezier curve path string (d)
  const pathD = useMemo(() => {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x},${points[0].y}`;
    let d = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const mx = (curr.x + next.x) / 2;
      d += ` C ${mx},${curr.y} ${mx},${next.y} ${next.x},${next.y}`;
    }
    return d;
  }, [points]);

  // Dynamically build polygon points for gradient fill under the curve
  const polygonPoints = useMemo(() => {
    if (points.length === 0) return '';
    const firstX = points[0].x;
    const lastX = points[points.length - 1].x;
    let poly = `${firstX},100 `;
    points.forEach((p) => {
      poly += `${p.x},${p.y} `;
    });
    poly += `${lastX},100`;
    return poly;
  }, [points]);

  const peakScore = points.length ? Math.max(...points.map((point) => point.score)) : null;
  return { points, pathD, polygonPoints, peakScore };
}
