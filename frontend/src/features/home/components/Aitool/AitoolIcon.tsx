import { memo } from 'react';
import { GraduationCap, ClipboardCheck, BriefcaseBusiness, MessagesSquare, CalendarDays, FilePenLine } from 'lucide-react';
import type { AitoolIconProps } from '../../types';

export const AitoolIcon = memo(function AitoolIcon({ name }: AitoolIconProps) {
  switch (name) {
    case 'auto_awesome': return <GraduationCap aria-hidden="true" size={20} strokeWidth={1.75} />;
    case 'quiz': return <ClipboardCheck aria-hidden="true" size={20} strokeWidth={1.75} />;
    case 'work_history': return <BriefcaseBusiness aria-hidden="true" size={20} strokeWidth={1.75} />;
    case 'chat_bubble': return <MessagesSquare aria-hidden="true" size={20} strokeWidth={1.75} />;
    case 'calendar_today': return <CalendarDays aria-hidden="true" size={20} strokeWidth={1.75} />;
    case 'rate_review': return <FilePenLine aria-hidden="true" size={20} strokeWidth={1.75} />;
    default: return null;
  }
});

AitoolIcon.displayName = 'AitoolIcon';
