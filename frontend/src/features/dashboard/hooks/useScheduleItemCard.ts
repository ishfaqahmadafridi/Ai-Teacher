'use client';

import type { UseScheduleItemCardOptions } from '../types/schedule.types';
import { useScheduleGridCell } from './useScheduleGridCell';

export function useScheduleItemCard(options: UseScheduleItemCardOptions) {
  return useScheduleGridCell(options);
}
