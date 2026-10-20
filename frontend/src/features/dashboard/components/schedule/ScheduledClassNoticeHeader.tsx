import { Dialog } from '@base-ui/react/dialog';
import { Clock, X } from 'lucide-react';

export function ScheduledClassNoticeHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-dashboard-subtle flex items-center justify-center text-dashboard-primary shrink-0 shadow-none">
          <Clock className="w-5 h-5" strokeWidth={1.75} aria-hidden="true" />
        </div>
        <div>
          <span className="text-xs font-medium text-dashboard-muted">
            Class availability
          </span>
          <Dialog.Title className="text-lg font-semibold text-dashboard-text mt-1 leading-snug">
            {title}
          </Dialog.Title>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="dashboard-button dashboard-button-secondary dashboard-button-icon shrink-0"
        aria-label="Close modal"
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
}
