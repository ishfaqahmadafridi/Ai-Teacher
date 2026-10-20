'use client';

import { memo } from 'react';
import { Bell, AlertTriangle, ShieldCheck, Volume2, KeyRound } from 'lucide-react';
import type { SettingsTabProps } from '../../types/settings.types';

export const NotificationsSecuritySettingsTab = memo(function NotificationsSecuritySettingsTab({
  settings,
  onChange,
  className = '',
}: SettingsTabProps) {
  return (
    <div className={`space-y-6 font-['Hanken_Grotesk',sans-serif] ${className}`}>
      {/* Change Password Form Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-dashboard-panel border border-dashboard-border space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-dashboard-subtle border border-dashboard-border flex items-center justify-center text-dashboard-muted shrink-0">
            <KeyRound aria-hidden="true" strokeWidth={1.75} className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-dashboard-text">Account Security & Password</h4>
            <p className="text-xs text-dashboard-muted">
              Update your account password and security credentials.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div>
            <label className="block text-[11px] font-semibold text-dashboard-muted uppercase tracking-wider mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={settings.currentPassword || ''}
              onChange={(e) => onChange('currentPassword', e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-dashboard-panel border border-dashboard-border rounded-xl px-4 py-2.5 text-sm text-dashboard-text placeholder:text-dashboard-muted focus:outline-none focus:border-dashboard-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-dashboard-muted uppercase tracking-wider mb-1">
                New Password
              </label>
              <input
                type="password"
                value={settings.newPassword || ''}
                onChange={(e) => onChange('newPassword', e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full bg-dashboard-panel border border-dashboard-border rounded-xl px-4 py-2.5 text-sm text-dashboard-text placeholder:text-dashboard-muted focus:outline-none focus:border-dashboard-primary"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-dashboard-muted uppercase tracking-wider mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={settings.confirmPassword || ''}
                onChange={(e) => onChange('confirmPassword', e.target.value)}
                placeholder="Re-enter new password"
                className="w-full bg-dashboard-panel border border-dashboard-border rounded-xl px-4 py-2.5 text-sm text-dashboard-text placeholder:text-dashboard-muted focus:outline-none focus:border-dashboard-primary"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Email Assignment Alerts */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-dashboard-panel border border-dashboard-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-dashboard-subtle border border-dashboard-border flex items-center justify-center text-dashboard-muted shrink-0">
            <Bell aria-hidden="true" strokeWidth={1.75} className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-dashboard-text">Email Assignment & Quiz Reminders</h4>
            <p className="text-xs text-dashboard-muted">
              Receive notification emails 24h before assignment deadlines.
            </p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-label="Email assignment and quiz reminders"
          aria-checked={settings.emailAssignmentAlerts}
          onClick={() => onChange('emailAssignmentAlerts', !settings.emailAssignmentAlerts)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-dashboard-primary focus-visible:ring-offset-2 ${
            settings.emailAssignmentAlerts ? 'bg-dashboard-primary' : 'bg-dashboard-subtle'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-none ring-0 transition duration-200 ease-in-out ${
              settings.emailAssignmentAlerts ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Disruption Warning Alerts */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-dashboard-panel border border-dashboard-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-dashboard-subtle border border-dashboard-border flex items-center justify-center text-dashboard-muted shrink-0">
            <AlertTriangle aria-hidden="true" strokeWidth={1.75} className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-dashboard-text">Class Disruption Warning Notices</h4>
            <p className="text-xs text-dashboard-muted">
              Get real-time warning alerts if behavior warnings are issued.
            </p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-label="Class disruption warning notices"
          aria-checked={settings.disruptionWarningsAlerts}
          onClick={() => onChange('disruptionWarningsAlerts', !settings.disruptionWarningsAlerts)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-dashboard-primary focus-visible:ring-offset-2 ${
            settings.disruptionWarningsAlerts ? 'bg-dashboard-primary' : 'bg-dashboard-subtle'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-none ring-0 transition duration-200 ease-in-out ${
              settings.disruptionWarningsAlerts ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* UI Sound Effects */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-dashboard-panel border border-dashboard-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-dashboard-subtle border border-dashboard-border flex items-center justify-center text-dashboard-muted shrink-0">
            <Volume2 aria-hidden="true" strokeWidth={1.75} className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-dashboard-text">Interface Audio Cues</h4>
            <p className="text-xs text-dashboard-muted">
              Play subtle audio clicks and success chimes when submitting quizzes.
            </p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-label="Interface audio cues"
          aria-checked={settings.soundEffects}
          onClick={() => onChange('soundEffects', !settings.soundEffects)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-dashboard-primary focus-visible:ring-offset-2 ${
            settings.soundEffects ? 'bg-dashboard-primary' : 'bg-dashboard-subtle'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-none ring-0 transition duration-200 ease-in-out ${
              settings.soundEffects ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Security Info Card */}
      <div className="p-4 rounded-2xl bg-dashboard-panel border border-dashboard-border flex items-center justify-between gap-3 text-xs text-dashboard-success">
        <div className="flex items-center gap-2">
          <ShieldCheck aria-hidden="true" strokeWidth={1.75} className="w-5 h-5 shrink-0" />
          <span>Active Session: Current Device (macOS • Chrome) — Token SSL Encrypted.</span>
        </div>
      </div>
    </div>
  );
});

NotificationsSecuritySettingsTab.displayName = 'NotificationsSecuritySettingsTab';
