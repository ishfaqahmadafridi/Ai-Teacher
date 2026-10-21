 'use client';
import { useState } from 'react';
export function useCourseOutlineCard() {
  const [isStudyPlanOpen, setStudyPlanOpen] = useState(false);
  const [isOpen, setOpen] = useState(false);
  return { isStudyPlanOpen, openStudyPlan: () => setStudyPlanOpen(true), closeStudyPlan: () => setStudyPlanOpen(false), isOpen, open: () => setOpen(true), close: () => setOpen(false) };
}
