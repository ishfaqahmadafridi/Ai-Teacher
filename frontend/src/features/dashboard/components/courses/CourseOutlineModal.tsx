 'use client';
import { memo } from 'react';
import { DashboardDialog } from '../modals/DashboardDialog';
import { CourseOutlineEditor } from './CourseOutlineEditor';
import type { CourseOutlineEditorProps } from '../../types/courses.types';
export const CourseOutlineModal = memo(function CourseOutlineModal(props: CourseOutlineEditorProps) {
  return <DashboardDialog title={`Course outline: ${props.course.title}`} onClose={props.onClose} className="max-w-[44rem]"><CourseOutlineEditor {...props} /></DashboardDialog>;
});
CourseOutlineModal.displayName = 'CourseOutlineModal';
