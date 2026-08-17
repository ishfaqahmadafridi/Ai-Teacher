'use client';

import { useMemo, useCallback } from 'react';
import {
  getAssignmentCardContainerStyles,
  getAssignmentActionButtonStyles,
} from '../utilities/assignmentsUtils';
import type { UseAssignmentCardOptions } from '../types/assignments.types';

export function useAssignmentCard(options: UseAssignmentCardOptions) {
  const { item, onOpenSubmitModal, onOpenQuizPlayerModal, onAskAiHelp } = options;

  const isQuiz = item.type === 'quiz';
  const isSubmitted = item.status === 'submitted';
  const isGraded = item.status === 'graded';
  const isUrgent = Boolean(item.isUrgent || item.status === 'urgent');

  const containerBgStyles = useMemo(() => {
    return getAssignmentCardContainerStyles(isUrgent, isGraded);
  }, [isUrgent, isGraded]);

  const actionBtnStyles = useMemo(() => {
    return getAssignmentActionButtonStyles(isQuiz, isGraded, isSubmitted, isUrgent);
  }, [isQuiz, isGraded, isSubmitted, isUrgent]);

  const actionButtonText = useMemo(() => {
    if (isQuiz) {
      return isGraded ? 'Review Quiz' : 'Take Quiz';
    }
    return isSubmitted || isGraded ? 'View Submission' : 'Turn In Work';
  }, [isQuiz, isGraded, isSubmitted]);

  const handleActionClick = useCallback(() => {
    if (isQuiz) {
      onOpenQuizPlayerModal(item);
    } else {
      onOpenSubmitModal(item);
    }
  }, [isQuiz, item, onOpenQuizPlayerModal, onOpenSubmitModal]);

  const handleAiHelpClick = useCallback(() => {
    onAskAiHelp?.(item.title);
  }, [item.title, onAskAiHelp]);

  return {
    isQuiz,
    isSubmitted,
    isGraded,
    isUrgent,
    containerBgStyles,
    actionBtnStyles,
    actionButtonText,
    handleActionClick,
    handleAiHelpClick,
  };
}
