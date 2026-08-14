'use client';

import { memo, useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import type { AnalyticsTrendGraphProps } from '../../types/analytics.types';

export const AnalyticsTrendGraph = memo(function AnalyticsTrendGraph({
  trendData,
  className = '',
}: AnalyticsTrendGraphProps) {
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

  return (
    <div className={`flex flex-col justify-between space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#38BDF8]" />
          <span className="font-['JetBrains_Mono',monospace] text-xs font-bold text-white uppercase tracking-wider">
            Learning Performance Curve
          </span>
        </div>
        <span className="font-['JetBrains_Mono',monospace] text-xs font-bold text-[#38BDF8]">
          Peak +95% Accuracy
        </span>
      </div>

      {/* SVG Dynamic Smooth Area Chart Graph */}
      <div className="w-full h-36 relative flex items-end pt-4">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 350 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Background Grid Lines */}
          <line x1="0" y1="25" x2="350" y2="25" stroke="#1E293B" strokeDasharray="3 3" strokeWidth="1" />
          <line x1="0" y1="50" x2="350" y2="50" stroke="#1E293B" strokeDasharray="3 3" strokeWidth="1" />
          <line x1="0" y1="75" x2="350" y2="75" stroke="#1E293B" strokeDasharray="3 3" strokeWidth="1" />

          {/* Dynamic Gradient Fill under Curve */}
          {polygonPoints && (
            <polygon points={polygonPoints} fill="url(#performanceGradient)" />
          )}

          {/* Dynamic Smooth Performance Line Curve */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="#38BDF8"
              strokeWidth="3"
              strokeLinecap="round"
              className="drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]"
            />
          )}

          {/* Dynamic Data Point Dots */}
          {points.map((pt) => (
            <g key={pt.day}>
              <circle cx={pt.x} cy={pt.y} r="4" fill="#0E172A" stroke="#38BDF8" strokeWidth="2.5" />
            </g>
          ))}
        </svg>
      </div>

      {/* X-Axis Day Labels */}
      <div className="flex justify-between text-[11px] font-mono text-[#94A3B8] font-semibold px-1">
        {points.map((pt) => (
          <span key={pt.day}>{pt.day}</span>
        ))}
      </div>
    </div>
  );
});

AnalyticsTrendGraph.displayName = 'AnalyticsTrendGraph';
