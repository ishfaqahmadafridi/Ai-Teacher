'use client';

import { useState, useCallback, useMemo } from 'react';
import type { AssignmentQuizItem } from '../types/assignments.types';

export function useQuizPlayer(
  item: AssignmentQuizItem | null,
  onCompleteQuiz: (itemId: string, score: number, maxScore: number) => void,
  onClose: () => void
) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const questions = useMemo(() => item?.quizQuestions || [], [item]);
  const currentQuestion = questions[currentQuestionIndex] || null;
  const totalQuestions = questions.length;

  const handleSelectOption = useCallback(
    (optionId: string) => {
      if (isSubmitted || !currentQuestion) return;
      setSelectedAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: optionId,
      }));
    },
    [isSubmitted, currentQuestion]
  );

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [currentQuestionIndex, totalQuestions]);

  const handlePrevQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex]);

  const quizResult = useMemo(() => {
    let earnedScore = 0;
    let maxPossibleScore = 0;

    questions.forEach((q) => {
      maxPossibleScore += q.points;
      if (selectedAnswers[q.id] === q.correctOptionId) {
        earnedScore += q.points;
      }
    });

    const percentage =
      maxPossibleScore > 0 ? Math.round((earnedScore / maxPossibleScore) * 100) : 0;

    return {
      earnedScore,
      maxPossibleScore,
      percentage,
    };
  }, [questions, selectedAnswers]);

  const handleSubmitQuiz = useCallback(() => {
    setIsSubmitted(true);
    if (item) {
      onCompleteQuiz(item.id, quizResult.earnedScore, quizResult.maxPossibleScore);
    }
  }, [item, quizResult, onCompleteQuiz]);

  const handleFinishAndClose = useCallback(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    onClose();
  }, [onClose]);

  const headerProps = useMemo(
    () => ({
      title: item?.title || '',
      subject: item?.subject || '',
      points: item?.points || 0,
      onClose,
    }),
    [item?.title, item?.subject, item?.points, onClose]
  );

  const resultViewProps = useMemo(
    () => ({
      quizResult,
      onFinishAndClose: handleFinishAndClose,
    }),
    [quizResult, handleFinishAndClose]
  );

  const questionStepProps = useMemo(
    () => ({
      currentQuestionIndex,
      totalQuestions,
      currentQuestion,
      selectedAnswers,
      onSelectOption: handleSelectOption,
    }),
    [currentQuestionIndex, totalQuestions, currentQuestion, selectedAnswers, handleSelectOption]
  );

  const footerProps = useMemo(
    () => ({
      currentQuestionIndex,
      totalQuestions,
      onPrevQuestion: handlePrevQuestion,
      onNextQuestion: handleNextQuestion,
      onSubmitQuiz: handleSubmitQuiz,
    }),
    [currentQuestionIndex, totalQuestions, handlePrevQuestion, handleNextQuestion, handleSubmitQuiz]
  );

  return {
    isSubmitted,
    headerProps,
    resultViewProps,
    questionStepProps,
    footerProps,
    currentQuestionIndex,
    totalQuestions,
    currentQuestion,
    selectedAnswers,
    quizResult,
    handleSelectOption,
    handleNextQuestion,
    handlePrevQuestion,
    handleSubmitQuiz,
    handleFinishAndClose,
  };
}
