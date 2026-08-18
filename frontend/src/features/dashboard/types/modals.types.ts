import type { StudentProfile } from './dashboard.types';

export interface DashboardDialogsProps {
  isRegisterCourseModalOpen: boolean;
  onCloseRegisterCourseModal: () => void;
  onRegisterCourse: (courseData: {
    subjectField: string;
    title: string;
    courseCode: string;
    creditHours: number;
  }) => void;
  isProfileOpen: boolean;
  onCloseProfile: () => void;
  profile: StudentProfile;
  onSaveProfile: (updated: Partial<StudentProfile>) => void;
  isSettingsOpen: boolean;
  onCloseSettings: () => void;
}
