'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SettingsTabId, ProjectSettingsState, ProjectSettingsModalProps } from '../types/settings.types';
import { DEFAULT_PROJECT_SETTINGS } from '../constants/settingsConstants';

const LOCAL_STORAGE_KEY = 'ai_teacher_project_settings';

export function useSettingsModal({ isOpen, onClose }: ProjectSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<SettingsTabId>('ai_mentor');
  const [settings, setSettings] = useState<ProjectSettingsState>(DEFAULT_PROJECT_SETTINGS);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Load saved settings from localStorage when modal opens
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setSettings((prev) => ({ ...prev, ...parsed }));
        }
      } catch (err) {
        console.error('Failed to load settings from localStorage', err);
      }
    }
  }, [isOpen]);

  const handleChange = useCallback(
    <K extends keyof ProjectSettingsState>(field: K, value: ProjectSettingsState[K]) => {
      setSettings((prev) => ({ ...prev, [field]: value }));
      setIsSaved(false);
    },
    []
  );

  const handleSave = useCallback(
    (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
        }
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2500);
      } catch (err) {
        console.error('Failed to save settings to localStorage', err);
      }
    },
    [settings]
  );

  const handleResetDefaults = useCallback(() => {
    setSettings(DEFAULT_PROJECT_SETTINGS);
    setIsSaved(false);
  }, []);

  return {
    activeTab,
    setActiveTab,
    settings,
    isSaved,
    handleChange,
    handleSave,
    handleResetDefaults,
    onClose,
  };
}
