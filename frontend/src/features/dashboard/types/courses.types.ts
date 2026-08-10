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
  status: 'active' | 'completed' | 'upcoming';
}

export interface RegisteredCoursesSectionProps {
  courses?: RegisteredCourseItem[];
  fieldTitle?: string;
  onJoinCourse?: (id: string) => void;
  onOpenRegisterModal?: () => void;
  className?: string;
}

export interface RegisteredCourseCardProps {
  course: RegisteredCourseItem;
  onJoinCourse?: (id: string) => void;
  className?: string;
}

export interface RegisterCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterCourse: (courseData: {
    subjectField: string;
    title: string;
    courseCode: string;
    creditHours: number;
  }) => void;
  className?: string;
}

export interface RegisterCourseFormProps {
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
  onClose: () => void;
  className?: string;
}
