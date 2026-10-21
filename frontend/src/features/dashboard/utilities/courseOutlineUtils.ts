import { COURSE_OUTLINE_MAX_TOPICS, COURSE_OUTLINE_MAX_TITLE_LENGTH } from '../constants/courseOutlineConstants';
import type { CourseOutlineTopicDetail } from '../types/courses.types';

export function parseOutlineTopics(text: string): string[] {
  return text.split('\n').map(line => line.trim()).filter(Boolean);
}

export function validateOutlineTopics(topics: string[]): string | null {
  if (!topics.length || topics.length > COURSE_OUTLINE_MAX_TOPICS || topics.some(topic => topic.length > COURSE_OUTLINE_MAX_TITLE_LENGTH)) {
    return `Enter 1–${COURSE_OUTLINE_MAX_TOPICS} topics, one per line, with no more than ${COURSE_OUTLINE_MAX_TITLE_LENGTH} characters each.`;
  }
  if (new Set(topics.map(topic => topic.toLowerCase())).size !== topics.length) return 'Remove duplicate topics before saving.';
  return null;
}

export function cleanOutlineDetails(details: CourseOutlineTopicDetail[], topics: string[]): CourseOutlineTopicDetail[] {
  return details.filter(item => topics.includes(item.title)).map(item => ({
    ...item,
    subtopics: item.subtopics.map(value => value.trim()).filter(Boolean),
    exercises: item.exercises.map(value => value.trim()).filter(Boolean),
  }));
}

export function updateOutlineDetail(details: CourseOutlineTopicDetail[], title: string, field: 'subtopics' | 'exercises', value: string): CourseOutlineTopicDetail[] {
  const current = details.find(item => item.title === title) ?? { title, subtopics: [], exercises: [] };
  return [...details.filter(item => item.title !== title), { ...current, [field]: value.split('\n') }];
}
