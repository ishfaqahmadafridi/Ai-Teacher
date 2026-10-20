import { memo } from 'react';
import { BookOpen, GraduationCap, BriefcaseBusiness, Lightbulb, ClipboardCheck, Laptop } from 'lucide-react';
import type { TailoredLevelsIconProps } from '../../../types';

export const TailoredLevelsIcon = memo(function TailoredLevelsIcon({ name }: TailoredLevelsIconProps) {
  switch (name) {
    case 'book': return <BookOpen aria-hidden="true" size={20} strokeWidth={1.75} />;
    case 'graduation-cap': return <GraduationCap aria-hidden="true" size={20} strokeWidth={1.75} />;
    case 'briefcase': return <BriefcaseBusiness aria-hidden="true" size={20} strokeWidth={1.75} />;
    case 'sparkles': return <Lightbulb aria-hidden="true" size={20} strokeWidth={1.75} />;
    case 'checkbox': return <ClipboardCheck aria-hidden="true" size={20} strokeWidth={1.75} />;
    case 'laptop': return <Laptop aria-hidden="true" size={20} strokeWidth={1.75} />;
    default: return null;
  }
});

TailoredLevelsIcon.displayName = 'TailoredLevelsIcon';
