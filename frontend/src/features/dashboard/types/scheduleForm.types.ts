import type { DayOfWeek, ScheduleItem } from './scheduleDomain.types';

export interface CreateScheduleSlotFormValues {
  title: string;
  subject: string;
  dayOfWeek: DayOfWeek;
  timeSlot: string;
  instructorName: string;
  roomOrLink: string;
  status: 'upcoming' | 'live' | 'completed';
}

export interface CreateScheduleSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddScheduleSlot: (item: ScheduleItem) => void | Promise<void>;
}

export interface UseCreateScheduleSlotModalOptions {
  onClose: () => void;
  onAddScheduleSlot: (item: ScheduleItem) => void | Promise<void>;
}

export interface CreateScheduleSlotHeaderProps {
  onClose: () => void;
  className?: string;
}

export interface CreateScheduleSlotFooterProps {
  onClose: () => void;
  className?: string;
}

export interface ScheduleSlotFieldsProps {
  model: ReturnType<typeof import('../hooks/useCreateScheduleSlotModal').useCreateScheduleSlotModal>;
}
