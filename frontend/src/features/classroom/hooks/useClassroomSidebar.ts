'use client';

import { useState, useCallback, useMemo } from 'react';
import { useBrowserStorage } from '@/shared/hooks/useBrowserStorage';
import type { ClassroomSidebarTabId, UseClassroomSidebarOptions } from '../types/sidebar.types';
import { DEFAULT_ACTIVE_TOPIC_ID, DEFAULT_LESSON_TOPICS, DEFAULT_LECTURE_TITLE } from '../constants/sidebarConstants';

const STORAGE_KEY = 'classroom_sidebar_expanded_sections';

export function useClassroomSidebar(options: UseClassroomSidebarOptions = {}) {
  const stored = useBrowserStorage(STORAGE_KEY);
  const [overrides, setExpandedSections] = useState<Record<ClassroomSidebarTabId, boolean> | null>(null);
  const expandedSections = useMemo(() => {
    if (overrides) return overrides;
    const defaults = {
      outline: true, notes: options.defaultTab === 'notes',
      doubts: options.defaultTab === 'doubts', suggestions: options.defaultTab === 'suggestions',
    };
    try {
      const saved: unknown = stored ? JSON.parse(stored) : null;
      if (saved && typeof saved === 'object') {
        for (const key of Object.keys(defaults) as ClassroomSidebarTabId[]) {
          const value = (saved as Record<string, unknown>)[key];
          if (typeof value === 'boolean') defaults[key] = value;
        }
      }
    } catch { /* Invalid storage falls back to defaults. */ }
    return defaults;
  }, [stored, overrides, options.defaultTab]);
  const [activeTopicId, setActiveTopicId] = useState<string>(DEFAULT_ACTIVE_TOPIC_ID);

  const activeTopicTitle = useMemo(() => {
    const found = DEFAULT_LESSON_TOPICS.find((topic) => topic.id === activeTopicId);
    return found ? found.title : DEFAULT_LECTURE_TITLE;
  }, [activeTopicId]);

  const toggleSection = useCallback((sectionId: ClassroomSidebarTabId) => {
    const updated = { ...expandedSections, [sectionId]: !expandedSections[sectionId] };
    setExpandedSections(updated);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch { /* Storage may be unavailable. */ }
  }, [expandedSections]);

  const handleSelectTopic = useCallback((topicId: string) => {
    setActiveTopicId(topicId);
  }, []);

  return {
    expandedSections,
    activeTopicId,
    activeTopicTitle,
    toggleSection,
    handleSelectTopic,
  };
}
