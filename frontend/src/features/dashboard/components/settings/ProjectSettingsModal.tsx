'use client';

import { memo } from 'react';
import { DashboardDialog } from '../modals/DashboardDialog';
import { X, Check, RotateCcw } from 'lucide-react';
import { useSettingsModal } from '../../hooks/useSettingsModal';
import { SettingsTabNav } from './SettingsTabNav';
import { AIMentorSettingsTab } from './AIMentorSettingsTab';
import { GeneralThemeSettingsTab } from './GeneralThemeSettingsTab';
import { StudyGoalsSettingsTab } from './StudyGoalsSettingsTab';
import { NotificationsSecuritySettingsTab } from './NotificationsSecuritySettingsTab';
import { AcademicPreferencesTab } from './AcademicPreferencesTab';
import type { ProjectSettingsModalProps } from '../../types/settings.types';

export const ProjectSettingsModal = memo(function ProjectSettingsModal(
  props: ProjectSettingsModalProps
) {
  const {
    activeTab,
    setActiveTab,
    settings,
    isSaved,
    handleChange,
    handleSave,
    handleResetDefaults,
    onClose,
  } = useSettingsModal(props);

  if (!props.isOpen) return null;

  return (
    <DashboardDialog title="Project Preferences & Settings" onClose={onClose} className="max-w-[72rem]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-dashboard-border bg-dashboard-panel">
          <div>
            <h2 className="text-xl font-bold text-dashboard-text tracking-tight">
              Project Preferences & Settings
            </h2>
            <p className="text-xs text-dashboard-muted mt-0.5">
              Customize AI Teacher features, Lumina theme, study goals, notifications, and security.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-dashboard-subtle/60 hover:bg-dashboard-subtle text-dashboard-muted hover:text-dashboard-text flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close settings modal"
          >
            <X aria-hidden="true" strokeWidth={1.75} className="w-5 h-5" />
          </button>
        </div>

        {/* Body Container: Left Sidebar + Right Settings Panel */}
        <div className="flex flex-col md:flex-row min-h-[500px]">
          {/* Left Vertical Sidebar Nav */}
          <SettingsTabNav activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Right Main Settings Form */}
          <form onSubmit={handleSave} className="flex-1 flex flex-col justify-between p-6 sm:p-8 max-h-[78dvh] overflow-y-auto">
            <div className="space-y-6">
              {activeTab === 'ai_mentor' && (
                <AIMentorSettingsTab settings={settings} onChange={handleChange} />
              )}
              {activeTab === 'general' && (
                <GeneralThemeSettingsTab settings={settings} onChange={handleChange} />
              )}
              {activeTab === 'study_goals' && (
                <StudyGoalsSettingsTab settings={settings} onChange={handleChange} />
              )}
              {activeTab === 'academic' && (
                <AcademicPreferencesTab settings={settings} onChange={handleChange} />
              )}
              {activeTab === 'notifications' && (
                <NotificationsSecuritySettingsTab settings={settings} onChange={handleChange} />
              )}
            </div>

            {/* Footer Action Buttons */}
            <div className="mt-8 pt-4 border-t border-dashboard-border flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-dashboard-muted hover:text-dashboard-text transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>

              <div className="flex items-center gap-3">
                {isSaved && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-dashboard-success animate-in fade-in">
                    <Check aria-hidden="true" strokeWidth={1.75} className="w-4 h-4" />
                    <span>Saved!</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-dashboard-muted hover:text-dashboard-text transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-dashboard-primary hover:bg-dashboard-primary-hover text-white text-xs font-bold shadow-none transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
    </DashboardDialog>
  );
});

ProjectSettingsModal.displayName = 'ProjectSettingsModal';
