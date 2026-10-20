'use client';

import { memo } from 'react';
import type { AitoolCardProps } from '../../types';
import { AitoolIcon } from './AitoolIcon';
import { Card, CardTitle, CardDescription } from '../ui';

export const AitoolCard = memo(function AitoolCard({ tool }: AitoolCardProps) {
  return (
    <Card 
      className="p-6 border border-dashboard-border rounded-2xl bg-dashboard-panel transition-colors hover:border-dashboard-primary/30 relative overflow-hidden"
    >
      {/* Icon */}
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-dashboard-subtle border border-dashboard-border">
        <AitoolIcon name={tool.iconName} themeColor={tool.colorTheme} />
      </div>

      <CardTitle className="font-display-lg text-lg font-bold mb-3 text-dashboard-text tracking-tight">
        {tool.title}
      </CardTitle>
      <CardDescription className="font-body-md text-[14.5px] leading-relaxed text-dashboard-muted">
        {tool.description}
      </CardDescription>
    </Card>
  );
});

AitoolCard.displayName = 'AitoolCard';
