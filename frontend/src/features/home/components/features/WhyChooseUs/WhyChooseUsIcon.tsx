import { memo } from 'react';
import { Brain, Video, CalendarDays, ListChecks, ChartNoAxesCombined, Laptop } from 'lucide-react';
import type { WhyChooseUsIconProps } from '../../../types';

export const WhyChooseUsIcon = memo(function WhyChooseUsIcon({ name }: WhyChooseUsIconProps) {
  switch (name) {
    case 'brain': return <Brain aria-hidden="true" size={20} strokeWidth={1.75} />;
    case 'camera': return <Video aria-hidden="true" size={20} strokeWidth={1.75} />;
    case 'calendar': return <CalendarDays aria-hidden="true" size={20} strokeWidth={1.75} />;
    case 'checkbox': return <ListChecks aria-hidden="true" size={20} strokeWidth={1.75} />;
    case 'chart': return <ChartNoAxesCombined aria-hidden="true" size={20} strokeWidth={1.75} />;
    case 'laptop': return <Laptop aria-hidden="true" size={20} strokeWidth={1.75} />;
    default: return null;
  }
});

WhyChooseUsIcon.displayName = 'WhyChooseUsIcon';
