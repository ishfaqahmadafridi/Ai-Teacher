 'use client';
import { useState } from 'react';
export function useCourseOutlineCard() {
  const [isOpen, setOpen] = useState(false);
  return { isOpen, open: () => setOpen(true), close: () => setOpen(false) };
}
