'use client';
import { useAppSelector } from '@/hooks/useAppStore';
import { classroomInteraction } from '../utilities/classroomInteraction';

export function useClassroomInteraction() {
  const classroom = useAppSelector(state => state.classroom);
  return classroomInteraction(classroom);
}
