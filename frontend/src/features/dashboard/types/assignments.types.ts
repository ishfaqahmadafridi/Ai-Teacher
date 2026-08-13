import type { AssignmentItem } from './dashboard.types';

export type GcrItemType = 'assignment' | 'quiz';
export type GcrItemStatus = 'pending' | 'submitted' | 'graded' | 'urgent';

export interface QuizQuestionOption {
  id: string;
  text: string;
}

export interface QuizQuestionItem {
  id: string;
  questionText: string;
  options: QuizQuestionOption[];
  correctOptionId: string;
  explanation?: string;
  points: number;
}

export interface UserSubmission {
  submittedAt: string;
  files: {
    name: string;
    sizeFormatted: string;
    fileType?: string;
    type?: string;
    url?: string;
  }[];
  textNote?: string;
  grade?: {
    score: number;
    maxScore: number;
    feedback?: string;
  };
}

export interface AssignmentQuizItem {
  id: string;
  title: string;
  type: GcrItemType;
  subject: string;
  dueDate: string;
  dueDateFormatted: string;
  points: number;
  status: GcrItemStatus;
  isUrgent?: boolean;
  instructions: string;
  attachments?: {
    name: string;
    sizeFormatted: string;
    type: string;
  }[];
  quizQuestions?: QuizQuestionItem[];
  submission?: UserSubmission;
}

export interface AssignmentsSectionProps {
  studentName?: string;
  assignments?: AssignmentItem[];
  className?: string;
}

export interface AssignmentsGridProps {
  filteredItems: AssignmentQuizItem[];
  searchQuery: string;
  onOpenSubmitModal: (item: AssignmentQuizItem) => void;
  onOpenQuizPlayerModal: (item: AssignmentQuizItem) => void;
  className?: string;
}

export interface AssignmentsEmptyStateProps {
  searchQuery: string;
  className?: string;
}

export interface UseAssignmentsGridOptions {
  filteredItems: AssignmentQuizItem[];
}

export interface AssignmentsModalsContainerProps {
  isAssignModalOpen: boolean;
  isSubmitModalOpen: boolean;
  isQuizModalOpen: boolean;
  selectedItem: AssignmentQuizItem | null;
  onCloseAssignModal: () => void;
  onCloseSubmitModal: () => void;
  onCloseQuizPlayerModal: () => void;
  onAssignNewWork: (newWork: {
    title: string;
    type: GcrItemType;
    subject: string;
    dueDate: string;
    points: number;
    instructions: string;
    quizQuestions?: QuizQuestionItem[];
  }) => void;
  onSubmitWork: (
    itemId: string,
    submission: {
      files: { name: string; sizeFormatted: string; fileType: string }[];
      textNote?: string;
    }
  ) => void;
  onCompleteQuiz: (itemId: string, score: number, maxScore: number) => void;
}

export interface AssignmentCardProps {
  item: AssignmentQuizItem;
  onOpenSubmitModal: (item: AssignmentQuizItem) => void;
  onOpenQuizPlayerModal: (item: AssignmentQuizItem) => void;
  onAskAiHelp?: (title: string) => void;
  className?: string;
}

export interface AssignmentCardHeaderProps {
  type: GcrItemType;
  subject: string;
  points: number;
}

export interface AssignmentCardAttachmentsProps {
  attachments: { name: string; sizeFormatted: string; type: string }[];
}

export interface AssignmentCardGradeBannerProps {
  grade: { score: number; maxScore: number; feedback?: string };
}

export interface AssignmentCardBodyProps {
  item: AssignmentQuizItem;
  isGraded: boolean;
  className?: string;
}

export interface AssignmentCardFooterProps {
  item: AssignmentQuizItem;
  isQuiz: boolean;
  isSubmitted: boolean;
  isGraded: boolean;
  isUrgent: boolean;
  actionBtnStyles: string;
  actionButtonText: string;
  onActionClick: () => void;
  onAiHelpClick?: () => void;
  hasAiHelp: boolean;
}

export interface AssignmentCardStatusProps {
  dueDateFormatted: string;
  isUrgent: boolean;
  isSubmitted: boolean;
  isGraded: boolean;
  submittedAt?: string;
  className?: string;
}

export interface AssignmentCardActionButtonsProps {
  isQuiz: boolean;
  actionButtonText: string;
  actionBtnStyles: string;
  onActionClick: () => void;
  onAiHelpClick?: () => void;
  hasAiHelp: boolean;
  className?: string;
}

export interface UseAssignmentCardFooterOptions {
  isQuiz: boolean;
  isGraded: boolean;
  isSubmitted: boolean;
  isUrgent: boolean;
}

export interface UseAssignmentCardOptions {
  item: AssignmentQuizItem;
  onOpenSubmitModal: (item: AssignmentQuizItem) => void;
  onOpenQuizPlayerModal: (item: AssignmentQuizItem) => void;
  onAskAiHelp?: (title: string) => void;
}

export interface AssignmentsHeaderBannerProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onOpenAssignModal: () => void;
  totalCount: number;
  pendingCount: number;
  className?: string;
}

export interface AssignmentFilterTabItem {
  id: string;
  label: string;
}

export interface AssignmentsHeaderTitleProps {
  onOpenAssignModal: () => void;
  className?: string;
}

export interface AssignmentSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export interface AssignmentFilterTabsProps {
  tabs: AssignmentFilterTabItem[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  className?: string;
}

export interface UseAssignmentsHeaderBannerOptions {
  totalCount: number;
  pendingCount: number;
}

export interface AssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssignWork: (newWork: {
    title: string;
    type: GcrItemType;
    subject: string;
    dueDate: string;
    points: number;
    instructions: string;
    quizQuestions?: QuizQuestionItem[];
  }) => void;
}

export interface AssignModalHeaderProps {
  onClose: () => void;
  className?: string;
}

export interface AssignModalTypeSelectorProps {
  type: GcrItemType;
  onTypeChange: (type: GcrItemType) => void;
  className?: string;
}

export interface AssignModalFormFieldsProps {
  title: string;
  subject: string;
  dueDate: string;
  points: number;
  instructions: string;
  onTitleChange: (val: string) => void;
  onSubjectChange: (val: string) => void;
  onDueDateChange: (val: string) => void;
  onPointsChange: (val: number) => void;
  onInstructionsChange: (val: string) => void;
  className?: string;
}

export interface AssignTaskTitleInputProps {
  title: string;
  onTitleChange: (val: string) => void;
  className?: string;
}

export interface AssignSubjectPointsInputProps {
  subject: string;
  points: number;
  onSubjectChange: (val: string) => void;
  onPointsChange: (val: number) => void;
  className?: string;
}

export interface AssignDueDateInstructionsInputProps {
  dueDate: string;
  instructions: string;
  onDueDateChange: (val: string) => void;
  onInstructionsChange: (val: string) => void;
  className?: string;
}

export interface AssignModalFooterActionsProps {
  onClose: () => void;
  className?: string;
}

export interface SubmitAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: AssignmentQuizItem | null;
  onSubmitWork: (
    itemId: string,
    submission: {
      files: { name: string; sizeFormatted: string; fileType: string }[];
      textNote?: string;
    }
  ) => void;
}

export interface SubmitAssignmentHeaderProps {
  isAlreadySubmitted: boolean;
  title: string;
  subject: string;
  onClose: () => void;
  className?: string;
}

export interface SubmitAssignmentDetailsViewProps {
  submission: UserSubmission;
  className?: string;
}

export interface SubmitAssignmentDropzoneProps {
  isDragOver: boolean;
  onFileDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export interface SubmitAssignmentFilesListProps {
  files: { name: string; sizeFormatted: string; fileType: string }[];
  onRemoveFile: (index: number) => void;
  className?: string;
}

export interface SubmitAssignmentTextNoteInputProps {
  textNote: string;
  onTextNoteChange: (val: string) => void;
  className?: string;
}

export interface SubmitAssignmentFooterActionsProps {
  onClose: () => void;
  className?: string;
}

export interface QuizPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: AssignmentQuizItem | null;
  onCompleteQuiz: (itemId: string, score: number, maxScore: number) => void;
}

export interface QuizPlayerHeaderProps {
  title: string;
  subject: string;
  points: number;
  onClose: () => void;
  className?: string;
}

export interface QuizPlayerResultViewProps {
  quizResult: {
    earnedScore: number;
    maxPossibleScore: number;
    percentage: number;
  };
  onFinishAndClose: () => void;
  className?: string;
}

export interface QuizQuestionStepProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  currentQuestion: QuizQuestionItem | null;
  selectedAnswers: Record<string, string>;
  onSelectOption: (optionId: string) => void;
  className?: string;
}

export interface QuizPlayerFooterProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  onPrevQuestion: () => void;
  onNextQuestion: () => void;
  onSubmitQuiz: () => void;
  className?: string;
}

export interface AutoOpenTaskPayload {
  taskId: string;
  modalType: 'submit' | 'quiz';
}

export interface UseAssignmentsSectionOptions {
  initialItems?: AssignmentQuizItem[];
  autoOpenTask?: AutoOpenTaskPayload | null;
}

export interface AssignmentsSectionProps {
  studentName?: string;
  autoOpenTask?: AutoOpenTaskPayload | null;
  className?: string;
}
