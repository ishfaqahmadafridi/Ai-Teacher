import type { NotificationItem } from '../types/topbar.types';

export const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: '⏰ 1-Hour Assignment Reminder',
    message: 'Assignment "Build Neural Network Model from Scratch" is due in 1 hour! Turn in your submission file now.',
    timeFormatted: '55m left',
    type: 'deadline_reminder',
    isUnread: true,
    taskId: 'asg-101',
  },
  {
    id: 'notif-2',
    title: '📌 New Task Assigned',
    message: 'Teacher published a new assignment task: "Python Data Structures & Complexity Quiz #3".',
    timeFormatted: '2h ago',
    type: 'task_assigned',
    isUnread: true,
    taskId: 'quiz-201',
  },
  {
    id: 'notif-3',
    title: '🎉 Graded Feedback Available',
    message: 'Your submission for "Deep Learning Backpropagation" was graded: 38/40 PTS (95%).',
    timeFormatted: '1d ago',
    type: 'graded',
    isUnread: false,
    taskId: 'quiz-202',
  },
];
