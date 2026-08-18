'use client';

import { memo } from 'react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200 font-['Hanken_Grotesk',sans-serif]">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity cursor-pointer"
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-[#0F172A] border border-[#1E293B] rounded-3xl shadow-2xl z-10 my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-[#1E293B] bg-[#070D1A]">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Project Preferences & Settings
            </h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Customize AI Teacher features, Lumina theme, study goals, notifications, and security.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#1E293B]/60 hover:bg-[#1E293B] text-[#94A3B8] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close settings modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Container: Left Sidebar + Right Settings Panel */}
        <div className="flex flex-col md:flex-row min-h-[500px]">
          {/* Left Vertical Sidebar Nav */}
          <SettingsTabNav activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Right Main Settings Form */}
          <form onSubmit={handleSave} className="flex-1 flex flex-col justify-between p-6 sm:p-8 max-h-[68vh] overflow-y-auto">
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
            <div className="mt-8 pt-4 border-t border-[#1E293B] flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>

              <div className="flex items-center gap-3">
                {isSaved && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#10B981] animate-in fade-in">
                    <Check className="w-4 h-4" />
                    <span>Saved!</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#004AC6] text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

ProjectSettingsModal.displayName = 'ProjectSettingsModal';
