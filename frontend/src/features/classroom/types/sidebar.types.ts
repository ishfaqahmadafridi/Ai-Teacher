export interface LessonNavigatorHeaderProps {
  title?: string;
  moduleSubtitle?: string;
}

export interface LessonTopicItem {
  id: string;
  title: string;
  isLive?: boolean;
  isDisabled?: boolean;
}

export interface ActiveLessonTreeProps {
  moduleTitle?: string;
  topics?: LessonTopicItem[];
  activeTopicId?: string;
  onSelectTopic?: (topicId: string) => void;
}

export interface LessonTreeHeaderProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  className?: string;
}

export interface TopicStatusDotProps {
  isLive?: boolean;
  className?: string;
}

export interface TopicLiveBadgeProps {
  className?: string;
}

export interface TopicItemTitleProps {
  title: string;
  isLive?: boolean;
  isActive?: boolean;
  className?: string;
}

export interface LessonTopicItemRowProps {
  topic: LessonTopicItem;
  isActive: boolean;
  onSelectTopic: (id: string) => void;
  className?: string;
}

export interface MobileDrawerBackdropProps {
  onClose: () => void;
  className?: string;
}

export interface MobileDrawerHeaderProps {
  onClose: () => void;
  title?: string;
  moduleSubtitle?: string;
  className?: string;
}

export interface NavTabItem {
  id: string;
  label: string;
  iconName: 'students' | 'notes' | 'assignments' | 'quiz' | 'announcements';
  badgeCount?: number;
}

export interface NavTabButtonRowProps {
  tab: NavTabItem;
  isActive: boolean;
  onSelectTab: (id: string) => void;
  className?: string;
}

export interface NavTabIconProps {
  iconName: NavTabItem['iconName'];
  className?: string;
}

export interface StudentRecord {
  id: string;
  name: string;
  rollNumber: string;
  status: 'present' | 'absent' | 'late';
  avatarBg: string;
}

export interface StudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface NavTabListProps {
  activeTabId?: string;
  onSelectTab?: (tabId: string) => void;
  onOpenStudentsModal?: () => void;
}

export interface StudentsCardHeaderProps {
  presentCount: number;
  totalCount: number;
  isExpanded: boolean;
  onToggle: () => void;
  className?: string;
}

export interface StudentSummaryDotProps {
  variant: 'total' | 'present' | 'absent';
  className?: string;
}

export interface StudentSummaryRowProps {
  label: string;
  count: number;
  variant: 'total' | 'present' | 'absent';
  className?: string;
}

export interface StudentsCardProps {
  presentCount?: number;
  totalCount?: number;
  absentCount?: number;
  className?: string;
}

export interface StudentsModalHeaderProps {
  onClose: () => void;
  title?: string;
  subtitle?: string;
  className?: string;
}

export interface StudentsModalStatsBarProps {
  total: number;
  present: number;
  absent: number;
  className?: string;
}

export interface FilterPillButtonProps {
  id: 'all' | 'present' | 'absent';
  label: string;
  count: number;
  isActive: boolean;
  activeColor: string;
  onClick: (id: 'all' | 'present' | 'absent') => void;
  className?: string;
}

export interface RosterSearchInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export interface StudentsModalFilterBarProps {
  filter: 'all' | 'present' | 'absent';
  onFilterChange: (val: 'all' | 'present' | 'absent') => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  totalCount: number;
  presentCount: number;
  absentCount: number;
  className?: string;
}

export interface StudentRosterRowProps {
  student: StudentRecord;
  className?: string;
}

export interface SidebarProps {
  onAsk?: (q: string) => void;
  loading?: boolean;
  isPlaying?: boolean;
}

export interface KeyPointsPanelProps {
  isPlaying: boolean;
}

export interface SuggestionsListProps {
  onAsk: (q: string) => void;
  loading: boolean;
  isPlaying: boolean;
}

export interface VoiceSelectorProps {
  className?: string;
}

export type ClassroomSidebarTabId = 'outline' | 'notes' | 'doubts' | 'suggestions';

export interface QuickDoubtPanelProps {
  onAsk?: (question: string) => void;
  loading?: boolean;
  className?: string;
}

export interface LectureHeaderProps {
  lectureTitle?: string;
  subject?: string;
  moduleName?: string;
  topicCount?: number;
  className?: string;
}

export interface SidebarTabsProps {
  activeTab: ClassroomSidebarTabId | null;
  onTabChange: (tab: ClassroomSidebarTabId) => void;
  className?: string;
}

export interface TodayOutlinePanelProps {
  topics?: LessonTopicItem[];
  activeTopicId?: string;
  onSelectTopic?: (id: string) => void;
  className?: string;
}

export interface LectureNoteItem {
  id: string;
  title: string;
  content: string;
  formula?: string;
  tag?: string;
}

export interface LectureNotesPanelProps {
  notes?: LectureNoteItem[];
  activeTopicId?: string;
  className?: string;
}

export interface UseClassroomSidebarOptions {
  defaultTab?: ClassroomSidebarTabId;
}

export interface SidebarAccordionSectionProps {
  id: ClassroomSidebarTabId;
  title: string;
  badge?: string | number;
  icon: React.ComponentType<{ className?: string }>;
  isExpanded: boolean;
  onToggle: (id: ClassroomSidebarTabId) => void;
  children: React.ReactNode;
  className?: string;
}

export interface DoubtHeaderProps {
  title?: string;
  badge?: string;
  className?: string;
}

export interface DoubtPromptListProps {
  prompts: string[];
  onPromptClick: (prompt: string) => void;
  loading?: boolean;
  className?: string;
}

export interface DoubtInputFormProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  loading?: boolean;
  className?: string;
}

export interface NoteLanguageSelectorProps {
  selectedLanguage: string;
  savedCustomLang: string;
  activeLangLabel: string;
  onPillClick: (id: string) => void;
  className?: string;
}

export interface NoteCustomInputFormProps {
  customLangInput: string;
  onCustomLangInputChange: (value: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  className?: string;
}

export interface NoteDownloadActionCardProps {
  title: string;
  activeLangLabel: string;
  onDownloadPdf: () => void;
  onDownloadDocx: () => void;
  className?: string;
}

export interface LessonTopicItem {
  id: string;
  title: string;
  duration?: string;
  isLive?: boolean;
  isDisabled?: boolean;
}

export interface TodayOutlinePanelProps {
  topics?: LessonTopicItem[];
  activeTopicId?: string;
  onSelectTopic?: (topicId: string) => void;
  className?: string;
}

export interface OutlineAgendaHeaderProps {
  topicCount: number;
  className?: string;
}

export interface OutlineTopicCardProps {
  topic: LessonTopicItem;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  onSelectTopic?: (topicId: string) => void;
  className?: string;
}

export interface OutlineTopicListProps {
  topics: LessonTopicItem[];
  activeTopicId: string;
  onSelectTopic?: (topicId: string) => void;
  className?: string;
}





