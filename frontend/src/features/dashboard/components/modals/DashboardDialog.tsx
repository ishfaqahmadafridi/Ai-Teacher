'use client';

import { memo } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import type { DashboardDialogProps } from '../../types/modals.types';

export const DashboardDialog = memo(function DashboardDialog({
  title, onClose, children, className = '',
}: DashboardDialogProps) {
  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[100] bg-black/35 backdrop-blur-[2px]" />
        <Dialog.Popup className={`fixed left-1/2 top-1/2 z-[100] w-[calc(100%_-_2rem)] -translate-x-1/2 -translate-y-1/2 max-h-[calc(100dvh_-_2rem)] overflow-y-auto overscroll-contain rounded-2xl border border-dashboard-border bg-dashboard-panel text-dashboard-text shadow-xl outline-none ${className}`}>
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
});

DashboardDialog.displayName = 'DashboardDialog';
