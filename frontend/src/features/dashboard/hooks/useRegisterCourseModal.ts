'use client';

import { useState, useCallback } from 'react';
import type { RegisterCourseModalProps } from '../types/courses.types';

export function useRegisterCourseModal({
  isOpen,
  onClose,
  onRegisterCourse,
}: RegisterCourseModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [formData, setFormData] = useState({
    subjectField: '',
    title: '',
    courseCode: '',
    creditHours: 3,
  });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'creditHours' ? Number(value) : value,
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (isPending) return;
      if (!formData.title.trim() || !formData.subjectField || !formData.courseCode.trim()) {
        setError('Select a field and enter the course title and code.');
        return;
      }
      setError(null);
      setIsPending(true);

      try {
        await onRegisterCourse({
          subjectField: formData.subjectField,
          title: formData.title,
          courseCode: formData.courseCode.trim(),
          creditHours: formData.creditHours || 3,
        });
      } catch (failure: unknown) {
        setError(failure instanceof Error ? failure.message : 'Course could not be registered.');
        return;
      } finally {
        setIsPending(false);
      }

      setFormData({
        subjectField: '',
        title: '',
        courseCode: '',
        creditHours: 3,
      });
      onClose();
    },
    [formData, onRegisterCourse, onClose, isPending]
  );

  return {
    isOpen,
    error,
    isPending,
    formData,
    handleChange,
    handleSubmit,
  };
}
