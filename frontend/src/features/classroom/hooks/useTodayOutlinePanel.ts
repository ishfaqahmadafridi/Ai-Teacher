'use client';

import { useCallback } from 'react';
import type { TodayOutlinePanelProps } from '../types/sidebar.types';
import { DEFAULT_LESSON_TOPICS, DEFAULT_ACTIVE_TOPIC_ID } from '../constants/sidebarConstants';

export function useTodayOutlinePanel({
  topics = DEFAULT_LESSON_TOPICS,
  activeTopicId = DEFAULT_ACTIVE_TOPIC_ID,
  onSelectTopic,
}: TodayOutlinePanelProps = {}) {
  const handleSelect = useCallback(
    (topicId: string, isDisabled?: boolean) => {
      if (!isDisabled && onSelectTopic) {
        onSelectTopic(topicId);
      }
    },
    [onSelectTopic]
  );

  return {
    topics,
    activeTopicId,
    handleSelect,
  };
}
