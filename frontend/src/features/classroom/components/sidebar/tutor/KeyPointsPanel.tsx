'use client';

import { memo } from 'react';
import { useAppSelector } from '@/hooks/useAppStore';
import type { KeyPointsPanelProps } from '../../../types/sidebar.types';

export const KeyPointsPanel = memo(function KeyPointsPanel({ isPlaying }: KeyPointsPanelProps) {
  const points = useAppSelector((s) => s.classroom.chalkboardPoints);

  if (!points.length) return null;

  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs text-dashboard-muted font-medium uppercase tracking-wider mb-1">
        📋 Key Points
      </p>
      <ul className="flex flex-col gap-1">
        {points.map((pt, i) => (
          <li
            key={i}
            className={`text-sm px-3 py-2 rounded-lg border transition-all duration-300 ${
              isPlaying && i === points.length - 1
                ? 'border-violet-500/60 bg-violet-500/10 text-violet-200'
                : 'border-dashboard-border bg-dashboard-subtle/50 text-dashboard-muted'
            }`}
          >
            <span className="text-dashboard-primary mr-2">•</span>
            {pt}
          </li>
        ))}
      </ul>
    </div>
  );
});

KeyPointsPanel.displayName = 'KeyPointsPanel';
