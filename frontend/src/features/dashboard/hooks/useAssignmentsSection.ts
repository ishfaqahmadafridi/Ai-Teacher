'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { DEFAULT_ASSIGNMENTS_QUIZZES } from '../constants/assignmentsConstants';
import { filterAssignments, calculateGcrStats } from '../utilities/assignmentsUtils';
import type {
  AssignmentQuizItem,
  GcrItemType,
  QuizQuestionItem,
  UseAssignmentsSectionOptions,
} from '../types/assignments.types';

export function useAssignmentsSection(options: UseAssignmentsSectionOptions = {}) {
  const { initialItems = DEFAULT_ASSIGNMENTS_QUIZZES, autoOpenTask } = options;

  const [items, setItems] = useState<AssignmentQuizItem[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState('all');

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AssignmentQuizItem | null>(null);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFilterChange = useCallback((tab: string) => {
    setActiveFilterTab(tab);
  }, []);

  const handleOpenAssignModal = useCallback(() => {
    setIsAssignModalOpen(true);
  }, []);

  const handleCloseAssignModal = useCallback(() => {
    setIsAssignModalOpen(false);
  }, []);

  const handleOpenSubmitModal = useCallback((item: AssignmentQuizItem) => {
    setSelectedItem(item);
    setIsSubmitModalOpen(true);
  }, []);

  const handleCloseSubmitModal = useCallback(() => {
    setIsSubmitModalOpen(false);
    setSelectedItem(null);
  }, []);

  const handleOpenQuizPlayerModal = useCallback((item: AssignmentQuizItem) => {
    setSelectedItem(item);
    setIsQuizModalOpen(true);
  }, []);

  const handleCloseQuizPlayerModal = useCallback(() => {
    setIsQuizModalOpen(false);
    setSelectedItem(null);
  }, []);

  // Listen for notification autoOpenTask triggers
  useEffect(() => {
    if (!autoOpenTask) return;
    const targetItem = items.find((i) => i.id === autoOpenTask.taskId) || items[0];
    if (!targetItem) return;

    setSelectedItem(targetItem);
    if (autoOpenTask.modalType === 'quiz') {
      setIsQuizModalOpen(true);
    } else {
      setIsSubmitModalOpen(true);
    }
  }, [autoOpenTask, items]);

  const handleAssignNewWork = useCallback(
    (newWork: {
      title: string;
      type: GcrItemType;
      subject: string;
      dueDate: string;
      points: number;
      instructions: string;
      quizQuestions?: QuizQuestionItem[];
    }) => {
      const newItem: AssignmentQuizItem = {
        id: `gcr-${Date.now()}`,
        title: newWork.title,
        type: newWork.type,
        subject: newWork.subject,
        dueDate: newWork.dueDate,
        dueDateFormatted: `Due ${newWork.dueDate}`,
        points: newWork.points,
        status: 'pending',
        instructions: newWork.instructions,
        quizQuestions: newWork.quizQuestions,
      };

      setItems((prev) => [newItem, ...prev]);
    },
    []
  );

  const handleSubmitWork = useCallback(
    (
      itemId: string,
      submission: {
        files: { name: string; sizeFormatted: string; fileType: string }[];
        textNote?: string;
      }
    ) => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== itemId) return item;
          return {
            ...item,
            status: 'submitted',
            isUrgent: false,
            submission: {
              submittedAt: 'Just Now',
              files: submission.files,
              textNote: submission.textNote,
            },
          };
        })
      );
    },
    []
  );

  const handleCompleteQuiz = useCallback(
    (itemId: string, score: number, maxScore: number) => {
      const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== itemId) return item;
          return {
            ...item,
            status: 'graded',
            isUrgent: false,
            submission: {
              submittedAt: 'Just Now',
              files: [],
              textNote: `Completed Quiz with score ${score}/${maxScore} (${percentage}%)`,
              grade: {
                score: score,
                maxScore: maxScore,
                feedback: `Automatic Quiz Evaluation: ${percentage}% achieved.`,
              },
            },
          };
        })
      );
    },
    []
  );

  const filteredItems = useMemo(() => {
    return filterAssignments(items, searchQuery, activeFilterTab);
  }, [items, searchQuery, activeFilterTab]);

  const stats = useMemo(() => {
    return calculateGcrStats(items);
  }, [items]);

  const headerProps = useMemo(
    () => ({
      searchQuery,
      onSearchChange: handleSearchChange,
      activeFilter: activeFilterTab,
      onFilterChange: handleFilterChange,
      onOpenAssignModal: handleOpenAssignModal,
      totalCount: stats.total,
      pendingCount: stats.pendingCount,
    }),
    [
      searchQuery,
      handleSearchChange,
      activeFilterTab,
      handleFilterChange,
      handleOpenAssignModal,
      stats.total,
      stats.pendingCount,
    ]
  );

  const gridProps = useMemo(
    () => ({
      filteredItems,
      searchQuery,
      onOpenSubmitModal: handleOpenSubmitModal,
      onOpenQuizPlayerModal: handleOpenQuizPlayerModal,
    }),
    [filteredItems, searchQuery, handleOpenSubmitModal, handleOpenQuizPlayerModal]
  );

  const modalProps = useMemo(
    () => ({
      isAssignModalOpen,
      isSubmitModalOpen,
      isQuizModalOpen,
      selectedItem,
      onCloseAssignModal: handleCloseAssignModal,
      onCloseSubmitModal: handleCloseSubmitModal,
      onCloseQuizPlayerModal: handleCloseQuizPlayerModal,
      onAssignNewWork: handleAssignNewWork,
      onSubmitWork: handleSubmitWork,
      onCompleteQuiz: handleCompleteQuiz,
    }),
    [
      isAssignModalOpen,
      isSubmitModalOpen,
      isQuizModalOpen,
      selectedItem,
      handleCloseAssignModal,
      handleCloseSubmitModal,
      handleCloseQuizPlayerModal,
      handleAssignNewWork,
      handleSubmitWork,
      handleCompleteQuiz,
    ]
  );

  return {
    headerProps,
    gridProps,
    modalProps,
    searchQuery,
    activeFilterTab,
    filteredItems,
    stats,
    isAssignModalOpen,
    isSubmitModalOpen,
    isQuizModalOpen,
    selectedItem,
    handleSearchChange,
    handleFilterChange,
    handleOpenAssignModal,
    handleCloseAssignModal,
    handleOpenSubmitModal,
    handleCloseSubmitModal,
    handleOpenQuizPlayerModal,
    handleCloseQuizPlayerModal,
    handleAssignNewWork,
    handleSubmitWork,
    handleCompleteQuiz,
  };
}
