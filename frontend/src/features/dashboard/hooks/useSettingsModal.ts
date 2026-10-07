'use client';

import { useBrowserStorage } from '@/shared/hooks/useBrowserStorage';
import { useState, useEffect, useCallback, useMemo } from 'react';
import type { SettingsTabId, ProjectSettingsState, ProjectSettingsModalProps } from '../types/settings.types';
import { DEFAULT_PROJECT_SETTINGS } from '../constants/settingsConstants';

const LOCAL_STORAGE_KEY = 'ai_teacher_project_settings';

export function useSettingsModal({ isOpen, onClose }: ProjectSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<SettingsTabId>('ai_mentor');
  const stored = useBrowserStorage(LOCAL_STORAGE_KEY);
  const [draft, setSettings] = useState<ProjectSettingsState | null>(null);
  const [previousOpen, setPreviousOpen] = useState(isOpen);
  if (previousOpen !== isOpen) {
    setPreviousOpen(isOpen);
    if (isOpen) setSettings(null);
  }
  const settings = useMemo<ProjectSettingsState>(() => {
    if (draft) return draft;
    try { return { ...DEFAULT_PROJECT_SETTINGS, ...(stored ? JSON.parse(stored) : {}) }; }
    catch { return DEFAULT_PROJECT_SETTINGS; }
  }, [draft, stored]);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleChange = useCallback(
    <K extends keyof ProjectSettingsState>(field: K, value: ProjectSettingsState[K]) => {
      setSettings((prev) => ({ ...(prev ?? settings), [field]: value }));
      setIsSaved(false);
    },
    [settings]
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
