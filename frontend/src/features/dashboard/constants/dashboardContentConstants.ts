import type {
  ContinueLearningCourse,
  LiveClassItem,
  AssignmentItem,
} from '../types/dashboard.types';
import type { RegisteredCourseItem } from '../types/courses.types';
import type { ScheduleItem } from '../types/schedule.types';

export const DEFAULT_CONTINUE_LEARNING: ContinueLearningCourse = { id: '', title: '', chapter: '', progressPercent: 0 };

export const DEFAULT_REGISTERED_COURSES: RegisteredCourseItem[] = [];

export const DEFAULT_SCHEDULE_ITEMS: ScheduleItem[] = [];

export const DEFAULT_LIVE_CLASSES: LiveClassItem[] = [];

export const DEFAULT_ASSIGNMENTS: AssignmentItem[] = [];
