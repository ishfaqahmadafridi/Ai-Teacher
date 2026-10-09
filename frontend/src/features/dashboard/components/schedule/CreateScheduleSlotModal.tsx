'use client';

import { memo } from 'react';
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
        <div className="relative w-full max-w-xl p-6 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <CreateScheduleSlotHeader onClose={onClose} />

          {/* Error message */}
          {error && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs font-semibold">
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
        </div>
      </div>
    );
  }
);

CreateScheduleSlotModal.displayName = 'CreateScheduleSlotModal';
