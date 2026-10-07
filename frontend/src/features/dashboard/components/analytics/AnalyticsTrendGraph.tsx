'use client';

import { memo, useId } from 'react';
import { useAnalyticsTrendGraph } from '../../hooks/useAnalyticsTrendGraph';
import { TrendingUp } from 'lucide-react';
import type { AnalyticsTrendGraphProps } from '../../types/analytics.types';

export const AnalyticsTrendGraph = memo(function AnalyticsTrendGraph({
  trendData,
  className = '',
}: AnalyticsTrendGraphProps) {
  const gradientId = useId();
  const { points, pathD, polygonPoints, peakScore } = useAnalyticsTrendGraph(trendData);

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
          {peakScore !== null ? `Peak ${peakScore}%` : 'No activity yet'}
        </span>
      </div>

      {/* SVG Dynamic Smooth Area Chart Graph */}
      <div className="w-full h-36 relative flex items-end pt-4">
        {points.length === 0 && (
          <p className="absolute inset-0 flex items-center justify-center text-center text-xs text-slate-400">
            Your learning history will appear here when activity is recorded.
          </p>
        )}
        <svg className="w-full h-full overflow-visible" viewBox="0 0 350 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
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
            <polygon points={polygonPoints} fill={`url(#${gradientId})`} />
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
