'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import type { ClassroomSidebarTabId, UseClassroomSidebarOptions } from '../types/sidebar.types';
import { DEFAULT_ACTIVE_TOPIC_ID, DEFAULT_LESSON_TOPICS, DEFAULT_LECTURE_TITLE } from '../constants/sidebarConstants';

const STORAGE_KEY = 'classroom_sidebar_expanded_sections';

export function useClassroomSidebar(options: UseClassroomSidebarOptions = {}) {
  const [expandedSections, setExpandedSections] = useState<Record<ClassroomSidebarTabId, boolean>>({
    outline: options.defaultTab === 'outline' || true,
    notes: options.defaultTab === 'notes' || false,
    doubts: options.defaultTab === 'doubts' || false,
    suggestions: options.defaultTab === 'suggestions' || false,
  });

  const [activeTopicId, setActiveTopicId] = useState<string>(DEFAULT_ACTIVE_TOPIC_ID);

  // Load saved open/closed section state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setExpandedSections((prev) => ({
          ...prev,
          ...parsed,
        }));
      }
    } catch {
      // Fallback silently if localStorage unavailable
    }
  }, []);

  const activeTopicTitle = useMemo(() => {
    const found = DEFAULT_LESSON_TOPICS.find((topic) => topic.id === activeTopicId);
    return found ? found.title : DEFAULT_LECTURE_TITLE;
  }, [activeTopicId]);

  const toggleSection = useCallback((sectionId: ClassroomSidebarTabId) => {
    setExpandedSections((prev) => {
      const updated = {
        ...prev,
        [sectionId]: !prev[sectionId],
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Fallback silently if localStorage write fails
      }
      return updated;
    });
  }, []);

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
