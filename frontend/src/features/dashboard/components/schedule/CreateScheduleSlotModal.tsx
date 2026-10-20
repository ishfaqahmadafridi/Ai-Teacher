'use client';

import { memo } from 'react';
import { DashboardDialog } from '../modals/DashboardDialog';
import { ScheduleTopicFields } from './ScheduleTopicFields';
import { ScheduleTimingFields } from './ScheduleTimingFields';
import { ScheduleLocationFields } from './ScheduleLocationFields';
import { ScheduleStatusField } from './ScheduleStatusField';

import { useCreateScheduleSlotModal } from '../../hooks/useCreateScheduleSlotModal';
import { CreateScheduleSlotHeader } from './CreateScheduleSlotHeader';
import { CreateScheduleSlotFooter } from './CreateScheduleSlotFooter';
import type {
  CreateScheduleSlotModalProps,
} from '../../types/schedule.types';

export const CreateScheduleSlotModal = memo(
  function CreateScheduleSlotModal({
    isOpen,
    onClose,
    onAddScheduleSlot,
  }: CreateScheduleSlotModalProps) {
    const model = useCreateScheduleSlotModal({ onClose, onAddScheduleSlot });
    const { error, handleSubmit } = model;

    if (!isOpen) return null;

    return (
      <DashboardDialog title="Add Timetable Class Slot" onClose={onClose} className="max-w-[36rem] p-5 sm:p-6 space-y-6">
          {/* Header */}
          <CreateScheduleSlotHeader onClose={onClose} />

          {/* Error message */}
          {error && (
            <div className="p-3 rounded-xl bg-dashboard-danger/5 border border-dashboard-danger/20 text-dashboard-danger text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <ScheduleTopicFields model={model} />

            <ScheduleTimingFields model={model} />

            <ScheduleLocationFields model={model} />

            <ScheduleStatusField model={model} />

            {/* Footer */}
            <CreateScheduleSlotFooter onClose={onClose} />
          </form>
      </DashboardDialog>
    );
  }
);

CreateScheduleSlotModal.displayName = 'CreateScheduleSlotModal';
