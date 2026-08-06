'use client';

import { useState, useCallback } from 'react';
import {
  DEFAULT_LESSON_TOPICS,
  DEFAULT_MODULE_TITLE,
  DEFAULT_ACTIVE_TOPIC_ID,
} from '../constants/sidebarConstants';
import type { LessonTopicItem } from '../types/sidebar.types';

export interface UseActiveLessonTreeOptions {
  moduleTitle?: string;
  topics?: LessonTopicItem[];
  activeTopicId?: string;
  onSelectTopic?: (topicId: string) => void;
}

export function useActiveLessonTree(options: UseActiveLessonTreeOptions = {}) {
  const [isExpanded, setIsExpanded] = useState(true);

  const title = options.moduleTitle || DEFAULT_MODULE_TITLE;
  const topics = options.topics || DEFAULT_LESSON_TOPICS;
  const activeTopicId = options.activeTopicId || DEFAULT_ACTIVE_TOPIC_ID;

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handleSelectTopic = useCallback(
    (id: string) => {
      if (options.onSelectTopic) {
        options.onSelectTopic(id);
      }
    },
    [options.onSelectTopic]
  );

  return {
    isExpanded,
    title,
    topics,
    activeTopicId,
    toggleExpand,
    handleSelectTopic,
  };
}
