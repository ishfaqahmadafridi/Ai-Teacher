import type { LessonTopicItem, NavTabItem, StudentRecord, LectureNoteItem } from '../types/sidebar.types';

export interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
}

export const DEFAULT_LECTURE_TITLE = "Newton's Laws & Classical Dynamics";
export const DEFAULT_MODULE_NAME = "Module 2 • Physics Mechanics";

export const DEFAULT_LESSON_TOPICS: LessonTopicItem[] = [
  { id: 'intro', title: '1. Introduction to Dynamics' },
  { id: 'inertia', title: "2. First Law (Inertia & Motion)" },
  { id: 'core-formulae', title: "3. Second Law (F = m · a)", isLive: true },
  { id: 'action-reaction', title: "4. Third Law (Action-Reaction)" },
  { id: 'practical-examples', title: '5. Practical Friction & Gravity' },
];

export const DEFAULT_MODULE_TITLE = "Today's Outline";
export const DEFAULT_ACTIVE_TOPIC_ID = 'core-formulae';

export const DEFAULT_NAV_TABS: NavTabItem[] = [
  { id: 'notes', label: 'Notes', iconName: 'notes' },
  { id: 'assignments', label: 'Assignments', iconName: 'assignments' },
  { id: 'quiz', label: 'Quiz', iconName: 'quiz' },
  { id: 'announcements', label: 'Announcements', iconName: 'announcements' },
];

export const DEFAULT_LECTURE_NOTES: LectureNoteItem[] = [
  {
    id: 'intro',
    title: "1. Introduction to Dynamics",
    content: "Dynamics studies forces and their effect on particle motion in 3D space.",
    formula: "F_net = m · a",
    tag: "Introduction"
  },
  {
    id: 'inertia',
    title: "2. First Law (Inertia & Motion)",
    content: "An object remains at rest or in uniform motion in a straight line unless acted upon by a net external force.",
    formula: "∑F = 0 ⟹ a = 0",
    tag: "Inertia"
  },
  {
    id: 'core-formulae',
    title: "3. Second Law (F = m · a)",
    content: "The acceleration of an object is directly proportional to the net force and inversely proportional to its mass.",
    formula: "F_net = m · a",
    tag: "Core Live Formula"
  },
  {
    id: 'action-reaction',
    title: "4. Third Law (Action-Reaction)",
    content: "For every action force exerted, there is an equal magnitude and opposite direction reaction force.",
    formula: "F_A→B = -F_B→A",
    tag: "Symmetry"
  },
  {
    id: 'practical-examples',
    title: "5. Practical Friction & Gravity",
    content: "Attractive force between two point masses is inversely proportional to the square of their distance.",
    formula: "F_g = G · (m₁ · m₂) / r²",
    tag: "Gravity"
  }
];

export const DEFAULT_ATTENDANCE_SUMMARY: AttendanceSummary = {
  total: 32,
  present: 28,
  absent: 4,
};

export const MOCK_STUDENTS: StudentRecord[] = [
  { id: '1', name: 'Alex Johnson', rollNumber: 'ST-101', status: 'present', avatarBg: 'bg-blue-600' },
  { id: '2', name: 'Sophia Chen', rollNumber: 'ST-102', status: 'present', avatarBg: 'bg-emerald-600' },
  { id: '3', name: 'Marcus Brody', rollNumber: 'ST-103', status: 'present', avatarBg: 'bg-[#7c4dff]' },
  { id: '4', name: 'Emily Davis', rollNumber: 'ST-104', status: 'absent', avatarBg: 'bg-rose-600' },
  { id: '5', name: 'Liam Wilson', rollNumber: 'ST-105', status: 'present', avatarBg: 'bg-amber-600' },
  { id: '6', name: 'Olivia Martinez', rollNumber: 'ST-106', status: 'present', avatarBg: 'bg-indigo-600' },
  { id: '7', name: 'Ethan Hunt', rollNumber: 'ST-107', status: 'absent', avatarBg: 'bg-red-600' },
  { id: '8', name: 'Ava Taylor', rollNumber: 'ST-108', status: 'present', avatarBg: 'bg-teal-600' },
  { id: '9', name: 'Noah Anderson', rollNumber: 'ST-109', status: 'present', avatarBg: 'bg-cyan-600' },
  { id: '10', name: 'Isabella Thomas', rollNumber: 'ST-110', status: 'absent', avatarBg: 'bg-pink-600' },
  { id: '11', name: 'Lucas Jackson', rollNumber: 'ST-111', status: 'present', avatarBg: 'bg-purple-600' },
  { id: '12', name: 'Mia White', rollNumber: 'ST-112', status: 'present', avatarBg: 'bg-sky-600' },
  { id: '13', name: 'Benjamin Harris', rollNumber: 'ST-113', status: 'absent', avatarBg: 'bg-red-700' },
  { id: '14', name: 'Charlotte Martin', rollNumber: 'ST-114', status: 'present', avatarBg: 'bg-emerald-700' },
  { id: '15', name: 'Henry Thompson', rollNumber: 'ST-115', status: 'present', avatarBg: 'bg-blue-700' },
];

export const DEFAULT_CHAT_MESSAGES: import('../types/input.types').ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'AI Teacher',
    role: 'teacher',
    text: 'Welcome to Physics Mechanics Class! Today we are exploring Newton’s 2nd Law F = m · a.',
    timestamp: '10:00 AM',
  },
  {
    id: 'msg-2',
    sender: 'Sophia Chen',
    role: 'student',
    text: 'Can we also simulate pendulum swing under gravity?',
    timestamp: '10:02 AM',
  },
  {
    id: 'msg-3',
    sender: 'AI Teacher',
    role: 'teacher',
    text: 'Yes! Type any physics doubt or select a topic to draw 3D diagrams.',
    timestamp: '10:03 AM',
  },
];
