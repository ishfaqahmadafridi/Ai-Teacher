'use client';

import type { AitoolItem } from '../../types';
import { AitoolIcon } from './AitoolIcon';
import { Card, CardTitle, CardDescription } from '../ui';

interface AitoolCardProps {
  tool: AitoolItem;
}

export function AitoolCard({ tool }: AitoolCardProps) {
  const glowClass = tool.colorTheme === 'tertiary' 
    ? 'rgba(167, 139, 250, 0.08)' 
    : 'rgba(59, 130, 246, 0.08)';

  return (
    <Card 
      className="p-10 border border-white/5 rounded-[24px] bg-white/[0.015] hover:bg-white/[0.04] transition-all duration-300 group relative overflow-hidden backdrop-blur-md"
      style={{
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Subtle background blur bloom orb inside card */}
      <div 
        className="absolute -right-4 -top-4 w-24 h-24 rounded-full filter blur-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-300"
        style={{ background: glowClass }}
      />
      
      {/* Icon */}
      <div className="mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 inline-block">
        <AitoolIcon name={tool.iconName} themeColor={tool.colorTheme} />
      </div>

      <CardTitle className="font-display-lg text-lg font-bold mb-3 text-white tracking-wide">
        {tool.title}
      </CardTitle>
      <CardDescription className="font-body-md text-[14.5px] leading-relaxed text-blue-100/50">
        {tool.description}
      </CardDescription>
    </Card>
  );
}
