'use client';

import { memo } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { DashboardDialog } from '../modals/DashboardDialog';
import type { ClassConductRulesDialogProps } from '../../types/progress.types';

export const ClassConductRulesDialog = memo(function ClassConductRulesDialog({ banStatus, onClose }: ClassConductRulesDialogProps) {
  return (
    <DashboardDialog title="Class conduct rules" onClose={onClose} className="max-w-[32rem] p-5 sm:p-6 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-dashboard-subtle p-2.5 text-dashboard-muted"><ShieldCheck className="h-5 w-5" /></div>
          <div>
            <h2 className="text-lg font-bold">Class conduct rules</h2>
            <p className="text-sm text-dashboard-muted">Keep live classes respectful and focused.</p>
          </div>
        </div>
        <button type="button" onClick={onClose} aria-label="Close conduct rules" className="dashboard-button dashboard-button-icon shrink-0"><X className="h-4 w-4" /></button>
      </div>
      <div className={`rounded-xl border p-4 ${banStatus.isBanned ? 'border-dashboard-danger/20 bg-dashboard-danger/5' : 'border-dashboard-border bg-dashboard-subtle'}`}>
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-semibold">Warnings received</span>
          <span className="font-semibold tabular-nums">{banStatus.currentWarnings} / {banStatus.maxAllowed}</span>
        </div>
        <p className={`mt-2 text-sm ${banStatus.isBanned ? 'text-dashboard-danger' : 'text-dashboard-muted'}`}>
          {banStatus.isBanned ? 'Live class access is currently banned.' : banStatus.currentWarnings === 0 ? 'You have no conduct warnings.' : `${banStatus.remainingChances} warning${banStatus.remainingChances === 1 ? '' : 's'} remaining before live class access is banned.`}
        </p>
      </div>
      <div className="space-y-4 text-sm text-dashboard-muted leading-relaxed">
        <p><strong className="text-dashboard-text">Respect the class.</strong> Avoid disruptive behavior and keep questions relevant to the lesson.</p>
        <p><strong className="text-dashboard-text">Warning limit.</strong> Reaching {banStatus.maxAllowed} conduct warnings results in a permanent ban from live classes.</p>
        <p><strong className="text-dashboard-text">No fines or payments.</strong> Payments cannot remove warnings or restore banned access.</p>
      </div>
      <div className="flex justify-end border-t border-dashboard-border pt-4">
        <button type="button" onClick={onClose} className="dashboard-button dashboard-button-primary">Got it</button>
      </div>
    </DashboardDialog>
  );
});

ClassConductRulesDialog.displayName = 'ClassConductRulesDialog';
