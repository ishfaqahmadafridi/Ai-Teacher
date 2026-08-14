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
          iconBox: 'bg-[#2563EB]/20 text-[#38BDF8] border-[#2563EB]/30',
          hoverBorder: 'hover:border-[#2563EB]/50',
        };
      case 'purple':
        return {
          iconBox: 'bg-[#712AE2]/20 text-[#A855F7] border-[#712AE2]/30',
          hoverBorder: 'hover:border-[#712AE2]/50',
        };
      case 'amber':
        return {
          iconBox: 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30',
          hoverBorder: 'hover:border-[#F59E0B]/50',
        };
      case 'cyan':
        return {
          iconBox: 'bg-[#004AC6]/20 text-[#38BDF8] border-[#004AC6]/30',
          hoverBorder: 'hover:border-[#38BDF8]/50',
        };
      case 'emerald':
        return {
          iconBox: 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30',
          hoverBorder: 'hover:border-[#10B981]/50',
        };
      default:
        return {
          iconBox: 'bg-[#2563EB]/20 text-[#38BDF8] border-[#2563EB]/30',
          hoverBorder: 'hover:border-[#2563EB]/50',
        };
    }
  };

  const theme = getThemeClasses();

  return (
    <div
      className={`bg-[#070D1A]/90 rounded-2xl p-4 flex items-center gap-4 border border-[#1E293B] ${theme.hoverBorder} transition-all duration-300 group shadow-md ${className}`}
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border group-hover:scale-105 transition-transform ${theme.iconBox}`}
      >
        {renderIcon()}
      </div>
      <div className="min-w-0">
        <span className="font-['JetBrains_Mono',monospace] text-[10px] font-bold text-[#94A3B8] uppercase block truncate">
          {item.label}
        </span>
        <span className="font-['Hanken_Grotesk',sans-serif] text-base font-bold text-white truncate block mt-0.5">
          {item.value}
        </span>
      </div>
    </div>
  );
});

AnalyticsMetricCard.displayName = 'AnalyticsMetricCard';
