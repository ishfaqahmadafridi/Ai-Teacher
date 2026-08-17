import type { StudentProfile } from './dashboard.types';

export interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onSaveProfile: (updated: Partial<StudentProfile>) => void;
}

export interface ProfileAvatarHeaderProps {
  avatarUrl: string;
  studentName: string;
  showAvatarMenu: boolean;
  showAvatarPresets: boolean;
  onToggleAvatarMenu: () => void;
  onToggleAvatarPresets: () => void;
  onCloseAvatarMenu: () => void;
  onSelectPresetAvatar: (url: string) => void;
  onUploadAvatarClick: () => void;
  className?: string;
}

export interface ProfileAvatarMenuProps {
  showAvatarPresets: boolean;
  onToggleAvatarPresets: () => void;
  onCloseAvatarMenu: () => void;
  onSelectPresetAvatar: (url: string) => void;
  onUploadAvatarClick: () => void;
  className?: string;
}

export interface ProfileAvatarPresetGridProps {
  onSelectPresetAvatar: (url: string) => void;
  className?: string;
}

export interface ProfileCoverHeaderProps {
  coverUrl?: string;
  showCoverMenu: boolean;
  showCoverPresets: boolean;
  onToggleCoverMenu: () => void;
  onToggleCoverPresets: () => void;
  onCloseCoverMenu: () => void;
  onSelectPresetCover: (url: string) => void;
  onUploadCoverClick: () => void;
  onCloseModal: () => void;
  className?: string;
}

export interface ProfileCoverMenuProps {
  showCoverPresets: boolean;
  onToggleCoverPresets: () => void;
  onCloseCoverMenu: () => void;
  onSelectPresetCover: (url: string) => void;
  onUploadCoverClick: () => void;
  className?: string;
}

export interface ProfileCoverPresetGridProps {
  onSelectPresetCover: (url: string) => void;
  className?: string;
}

export interface ProfileCoverBackgroundProps {
  coverUrl?: string;
  className?: string;
}

export interface ProfileVerifiedBadgeProps {
  label?: string;
  className?: string;
}

export interface ProfileCoverControlsProps {
  showCoverMenu: boolean;
  showCoverPresets: boolean;
  onToggleCoverMenu: () => void;
  onToggleCoverPresets: () => void;
  onCloseCoverMenu: () => void;
  onSelectPresetCover: (url: string) => void;
  onUploadCoverClick: () => void;
  onCloseModal: () => void;
  className?: string;
}

export interface ProfileMetaInfoProps {
  name: string;
  email: string;
  phone: string;
  studentId: string;
  gradeLevel: string;
  className?: string;
}

export interface ProfilePersonalTabProps {
  formData: StudentProfile;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  className?: string;
}

export interface ProfilePreferencesTabProps {
  formData: StudentProfile;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  className?: string;
}

export interface ProfileIdentityFieldsProps {
  name: string;
  studentId: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export interface ProfileContactFieldsProps {
  email: string;
  phone: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export interface ProfileAcademicFieldsProps {
  gradeLevel: string;
  bio?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  className?: string;
}

export interface ProfileLanguageSelectorProps {
  preferredLanguage?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}

export interface ProfileNotificationTogglesProps {
  className?: string;
}

export interface ProfileModalTabNavProps {
  activeTab: 'personal' | 'preferences';
  onTabChange: (tab: 'personal' | 'preferences') => void;
  className?: string;
}

export interface ProfileModalFooterProps {
  isSaved: boolean;
  onClose: () => void;
  onLogout?: () => void;
  className?: string;
}

export interface ProfileFileInputsProps {
  avatarFileInputRef: React.RefObject<HTMLInputElement | null>;
  coverFileInputRef: React.RefObject<HTMLInputElement | null>;
  onAvatarFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCoverFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ProfileModalBackdropProps {
  onClick: () => void;
  className?: string;
}
