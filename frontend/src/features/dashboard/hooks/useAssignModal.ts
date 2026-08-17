'use client';

import { useState, useCallback } from 'react';
import type { GcrItemType, QuizQuestionItem } from '../types/assignments.types';

export function useAssignModal(
  onAssignWork: (newWork: {
    title: string;
    type: GcrItemType;
    subject: string;
    dueDate: string;
    points: number;
    instructions: string;
    quizQuestions?: QuizQuestionItem[];
  }) => void,
  onClose: () => void
) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<GcrItemType>('assignment');
  const [subject, setSubject] = useState('Computer Science');
  const [dueDate, setDueDate] = useState('');
  const [points, setPoints] = useState(100);
  const [instructions, setInstructions] = useState('');

  const [questions, setQuestions] = useState<QuizQuestionItem[]>([
    {
      id: 'q-1',
      questionText: 'Sample Quiz Question #1',
      points: 10,
      options: [
        { id: 'opt-1', text: 'Option A' },
        { id: 'opt-2', text: 'Option B' },
        { id: 'opt-3', text: 'Option C' },
        { id: 'opt-4', text: 'Option D' },
      ],
      correctOptionId: 'opt-1',
      explanation: 'Explanation for correct answer A.',
    },
  ]);

  const handleTitleChange = useCallback((val: string) => setTitle(val), []);
  const handleTypeChange = useCallback((val: GcrItemType) => setType(val), []);
  const handleSubjectChange = useCallback((val: string) => setSubject(val), []);
  const handleDueDateChange = useCallback((val: string) => setDueDate(val), []);
  const handlePointsChange = useCallback((val: number) => setPoints(val), []);
  const handleInstructionsChange = useCallback((val: string) => setInstructions(val), []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim() || !dueDate) {
        alert('Please provide a title and due date for the task.');
        return;
      }

      onAssignWork({
        title,
        type,
        subject,
        dueDate,
        points,
        instructions,
        quizQuestions: type === 'quiz' ? questions : undefined,
      });

      // Reset form
      setTitle('');
      setInstructions('');
      onClose();
    },
    [title, type, subject, dueDate, points, instructions, questions, onAssignWork, onClose]
  );

  return {
    title,
    type,
    subject,
    dueDate,
    points,
    instructions,
    questions,
    handleTitleChange,
    handleTypeChange,
    handleSubjectChange,
    handleDueDateChange,
    handlePointsChange,
    handleInstructionsChange,
    handleSubmit,
  };
}
