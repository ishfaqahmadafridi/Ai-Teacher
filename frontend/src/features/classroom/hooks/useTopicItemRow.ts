'use client';

import { useCallback } from 'react';
import { getTopicItemRowStyles } from '../utilities/styleUtils';
import type { LessonTopicItem } from '../types/sidebar.types';

export function useTopicItemRow(
  topic: LessonTopicItem,
  isActive: boolean,
  onSelectTopic: (id: string) => void,
  customClassName: string = ''
) {
  const handleClick = useCallback(() => {
    if (!topic.isDisabled) {
      onSelectTopic(topic.id);
    }
  }, [topic.isDisabled, topic.id, onSelectTopic]);

  const buttonClassName = getTopicItemRowStyles(topic.isDisabled, isActive, customClassName);

  return {
    handleClick,
    buttonClassName,
  };
}
