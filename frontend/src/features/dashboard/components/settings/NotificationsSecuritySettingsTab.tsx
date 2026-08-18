'use client';

import { memo } from 'react';
import { Bell, AlertTriangle, ShieldCheck, VolumeX, KeyRound } from 'lucide-react';
import type { SettingsTabProps } from '../../types/settings.types';

export const NotificationsSecuritySettingsTab = memo(function NotificationsSecuritySettingsTab({
  settings,
  onChange,
  className = '',
}: SettingsTabProps) {
  return (
    <div className={`space-y-6 font-['Hanken_Grotesk',sans-serif] ${className}`}>
      {/* Change Password Form Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090D16] border border-[#1E293B] space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-[#38BDF8] shrink-0">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Account Security & Password</h4>
            <p className="text-xs text-[#94A3B8]">
              Update your account password and security credentials.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div>
            <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={settings.currentPassword || ''}
              onChange={(e) => onChange('currentPassword', e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#070D1A] border border-[#1E293B] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#38BDF8]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                New Password
              </label>
              <input
                type="password"
                value={settings.newPassword || ''}
                onChange={(e) => onChange('newPassword', e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full bg-[#070D1A] border border-[#1E293B] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#38BDF8]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={settings.confirmPassword || ''}
                onChange={(e) => onChange('confirmPassword', e.target.value)}
                placeholder="Re-enter new password"
                className="w-full bg-[#070D1A] border border-[#1E293B] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#38BDF8]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Email Assignment Alerts */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#090D16] border border-[#1E293B]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-[#38BDF8] shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Email Assignment & Quiz Reminders</h4>
            <p className="text-xs text-[#94A3B8]">
              Receive notification emails 24h before assignment deadlines.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onChange('emailAssignmentAlerts', !settings.emailAssignmentAlerts)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            settings.emailAssignmentAlerts ? 'bg-[#2563EB]' : 'bg-[#1E293B]'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              settings.emailAssignmentAlerts ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Disruption Warning Alerts */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#090D16] border border-[#1E293B]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 flex items-center justify-center text-[#EF4444] shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Class Disruption Warning Notices</h4>
            <p className="text-xs text-[#94A3B8]">
              Get real-time warning alerts if behavior warnings are issued.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onChange('disruptionWarningsAlerts', !settings.disruptionWarningsAlerts)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            settings.disruptionWarningsAlerts ? 'bg-[#EF4444]' : 'bg-[#1E293B]'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              settings.disruptionWarningsAlerts ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* UI Sound Effects */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#090D16] border border-[#1E293B]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#C4B5FD] shrink-0">
            <VolumeX className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Interface Audio Cues</h4>
            <p className="text-xs text-[#94A3B8]">
              Play subtle audio clicks and success chimes when submitting quizzes.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onChange('soundEffects', !settings.soundEffects)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            settings.soundEffects ? 'bg-[#8B5CF6]' : 'bg-[#1E293B]'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              settings.soundEffects ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Security Info Card */}
      <div className="p-4 rounded-2xl bg-[#090D16] border border-[#1E293B] flex items-center justify-between gap-3 text-xs text-[#10B981]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <span>Active Session: Current Device (macOS • Chrome) — Token SSL Encrypted.</span>
        </div>
      </div>
    </div>
  );
});

NotificationsSecuritySettingsTab.displayName = 'NotificationsSecuritySettingsTab';
