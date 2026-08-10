'use client';

import { memo } from 'react';
import { RegisterSubjectFieldInput } from './RegisterSubjectFieldInput';
import { RegisterCourseTitleInput } from './RegisterCourseTitleInput';
import { RegisterCourseCodeHoursInputs } from './RegisterCourseCodeHoursInputs';
import { RegisterCourseFooterActions } from './RegisterCourseFooterActions';
import type { RegisterCourseFormProps } from '../../types/courses.types';

export const RegisterCourseForm = memo(function RegisterCourseForm({
  formData,
  onChange,
  onSubmit,
  onClose,
  className = '',
}: RegisterCourseFormProps) {
  return (
    <form onSubmit={onSubmit} className={`space-y-4 ${className}`}>
      {/* Subject Field / Academic Discipline */}
      <RegisterSubjectFieldInput
        subjectField={formData.subjectField}
        onChange={onChange}
      />

      {/* Course Title */}
      <RegisterCourseTitleInput
        title={formData.title}
        onChange={onChange}
      />

      {/* Course Code & Credit Hours */}
      <RegisterCourseCodeHoursInputs
        courseCode={formData.courseCode}
        creditHours={formData.creditHours}
        onChange={onChange}
      />

      {/* Modal Actions Footer */}
      <RegisterCourseFooterActions onClose={onClose} />
    </form>
  );
});

RegisterCourseForm.displayName = 'RegisterCourseForm';
