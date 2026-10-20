'use client';

import { memo } from 'react';
import { Award, Zap, Brain, Sparkles, FileCheck, HelpCircle } from 'lucide-react';
import type { AnalyticsMetricCardProps } from '../../types/analytics.types';

export const AnalyticsMetricCard = memo(function AnalyticsMetricCard({
  item,
  className = '',
}: AnalyticsMetricCardProps) {
  const renderIcon = () => {
    switch (item.iconName) {
      case 'file-check':
        return <FileCheck className="w-5 h-5" aria-hidden="true" />;
      case 'help-circle':
        return <HelpCircle className="w-5 h-5" aria-hidden="true" />;
      case 'zap':
        return <Zap className="w-5 h-5 fill-current" aria-hidden="true" />;
      case 'brain':
        return <Brain className="w-5 h-5" aria-hidden="true" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5" aria-hidden="true" />;
      case 'award':
        return <Award className="w-5 h-5" aria-hidden="true" />;
      default:
        return <Award className="w-5 h-5" aria-hidden="true" />;
    }
  };

  const getThemeClasses = () => {
    switch (item.accentTheme) {
      case 'blue':
        return {
          iconBox: 'bg-dashboard-subtle text-dashboard-muted border-dashboard-border',
          hoverBorder: 'hover:border-dashboard-border',
        };
      case 'purple':
        return {
          iconBox: 'bg-dashboard-subtle text-dashboard-muted border-dashboard-border',
          hoverBorder: 'hover:border-dashboard-border',
        };
      case 'amber':
        return {
          iconBox: 'bg-dashboard-subtle text-dashboard-muted border-dashboard-border',
          hoverBorder: 'hover:border-dashboard-border',
        };
      case 'cyan':
        return {
          iconBox: 'bg-dashboard-subtle text-dashboard-muted border-dashboard-border',
          hoverBorder: 'hover:border-dashboard-border',
        };
      case 'emerald':
        return {
          iconBox: 'bg-dashboard-subtle text-dashboard-muted border-dashboard-border',
          hoverBorder: 'hover:border-dashboard-border',
        };
      default:
        return {
          iconBox: 'bg-dashboard-subtle text-dashboard-muted border-dashboard-border',
          hoverBorder: 'hover:border-dashboard-border',
        };
    }
  };

  const theme = getThemeClasses();

  return (
    <div
      className={`bg-dashboard-panel/90 rounded-lg p-4 flex items-center gap-4 border border-dashboard-border ${theme.hoverBorder} transition-all duration-300 group shadow-none ${className}`}
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border group-hover:scale-105 transition-transform ${theme.iconBox}`}
      >
        {renderIcon()}
      </div>
      <div className="min-w-0">
        <span className="text-xs font-medium text-dashboard-muted block truncate">
          {item.label}
        </span>
        <span className="font-['Hanken_Grotesk',sans-serif] text-base font-bold text-dashboard-text truncate block mt-0.5">
          {item.value}
        </span>
      </div>
    </div>
  );
});

AnalyticsMetricCard.displayName = 'AnalyticsMetricCard';
