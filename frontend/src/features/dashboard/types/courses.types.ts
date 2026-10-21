export interface RegisteredCourseItem {
  id: string;
  title: string;
  subjectField: string;
  courseCode: string;
  creditHours: number;
  progressPercent: number;
  completedLessons: number;
  totalLessons: number;
  enrolledDate: string;
  outlineTopics?: string[];
  outlineSource?: string;
  outlinePeriod?: CourseOutlinePeriod;
  status: 'active' | 'completed' | 'upcoming';
}

export interface RegisteredCoursesSectionProps {
  onOpenTimetable?: () => void;
  courses?: RegisteredCourseItem[];
  fieldTitle?: string;
  onJoinCourse?: (id: string) => void;
  onOpenRegisterModal?: () => void;
  className?: string;
}

export interface RegisteredCourseCardProps {
  onOpenTimetable?: () => void;
  course: RegisteredCourseItem;
  onJoinCourse?: (id: string) => void;
  className?: string;
}

export interface RegisterCourseModalProps {
  onOpenTimetable?: () => void;
  isOpen: boolean;
  onClose: () => void;
  onRegisterCourse: (courseData: {
    subjectField: string;
    title: string;
    courseCode: string;
    creditHours: number;
  }) => Promise<RegisteredCourseItem>;
  className?: string;
}

export interface RegisterCourseFormProps {
  error: string | null;
  isPending: boolean;
  formData: {
    subjectField: string;
    title: string;
    courseCode: string;
    creditHours: number;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  className?: string;
}

export interface RegisterSubjectFieldInputProps {
  subjectField: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}

export interface RegisterCourseTitleInputProps {
  title: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export interface RegisterCourseCodeHoursInputsProps {
  courseCode: string;
  creditHours: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export interface RegisterCourseFooterActionsProps {
  isPending: boolean;
  onClose: () => void;
  className?: string;
}

export interface CourseOutlineTopicDetail {
  title: string;
  subtopics: string[];
  exercises: string[];
}
export interface CourseOutlineSession {
  title: string;
  day: string;
  date: string;
  start: string;
  end: string;
  timezone: string;
}
export interface CourseOutlinePeriod { start_date: string; duration_months: number }
export interface CoursePlanAssignment { exercise: string; instruction: string }
export interface CoursePlanQuiz { number: number; title: string; topics: string[] }
export interface CourseOutlineWeekItem { assignments?: CoursePlanAssignment[]; title: string; subtopics: string[]; exercises: string[]; activity: 'Lesson' | 'Practice' | 'Review' }
export interface CourseOutlineWeekTopic { assignments: CoursePlanAssignment[]; title: string; subtopics: string[]; exercises: string[]; activities: CourseOutlineWeekItem['activity'][] }
export interface CourseOutlineWeek { quiz?: CoursePlanQuiz | null; number: number; start: string; end: string; items: CourseOutlineWeekItem[] }
export interface CourseOutlineWeeksProps { weeks: CourseOutlineWeek[] }
export interface CourseOutline {
  period?: CourseOutlinePeriod | null;
  weeks?: CourseOutlineWeek[];
  details: CourseOutlineTopicDetail[];
  sessions: CourseOutlineSession[];
  topics: string[];
  source: '' | 'manual' | 'ai';
  updated_at: string | null;
}
export interface CourseOutlineEditorProps {
  onOpenTimetable?: () => void;
  course: RegisteredCourseItem;
  onClose: () => void;
}

export interface CourseOutlineTopicPlanProps {
  topics: string[];
  details: CourseOutlineTopicDetail[];
  sessions: CourseOutlineSession[];
  disabled: boolean;
  onUpdate: (title: string, field: 'subtopics' | 'exercises', value: string) => void;
}

export interface CourseStudyPlanModalProps {
  courses: RegisteredCourseItem[];
  initialCourseId?: string;
  onClose: () => void;
}
