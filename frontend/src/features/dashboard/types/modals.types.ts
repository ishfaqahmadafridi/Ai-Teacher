import type { ReactNode } from 'react';
import type { StudentProfile } from './dashboard.types';

export interface DashboardDialogsProps {
  isRegisterCourseModalOpen: boolean;
  onCloseRegisterCourseModal: () => void;
  onRegisterCourse: (courseData: {
    subjectField: string;
    title: string;
    courseCode: string;
    creditHours: number;
  }) => Promise<void>;
  isProfileOpen: boolean;
  onCloseProfile: () => void;
  profile: StudentProfile;
  onSaveProfile: (updated: Partial<StudentProfile>) => Promise<void>;
  isSettingsOpen: boolean;
  onCloseSettings: () => void;
}

export interface DashboardDialogProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}
