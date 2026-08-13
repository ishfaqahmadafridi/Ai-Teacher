import type { AssignmentQuizItem } from '../types/assignments.types';

export const DEFAULT_ASSIGNMENTS_QUIZZES: AssignmentQuizItem[] = [
  {
    id: 'asg-101',
    title: 'Build Neural Network Model from Scratch in Python',
    type: 'assignment',
    subject: 'Advanced AI & Deep Learning',
    dueDate: '2026-08-15',
    dueDateFormatted: 'Aug 15, 2026 (Tomorrow, 11:59 PM)',
    points: 100,
    status: 'urgent',
    isUrgent: true,
    instructions:
      'Implement forward propagation, cross-entropy loss, and backpropagation using NumPy only. Submit your `.ipynb` notebook file along with loss curve plots.',
    attachments: [
      { name: 'Neural_Network_Starter_Guide.pdf', sizeFormatted: '1.4 MB', type: 'pdf' },
      { name: 'dataset_mnist_sample.csv', sizeFormatted: '4.2 MB', type: 'csv' },
    ],
  },
  {
    id: 'quiz-201',
    title: 'Python Data Structures & Complexity Quiz #3',
    type: 'quiz',
    subject: 'Computer Science Fundamentals',
    dueDate: '2026-08-18',
    dueDateFormatted: 'Aug 18, 2026 (In 5 Days)',
    points: 50,
    status: 'pending',
    instructions:
      'Interactive multiple-choice quiz covering Big-O time complexity, binary search trees, hash maps, and recursion.',
    quizQuestions: [
      {
        id: 'q1',
        questionText: 'What is the average time complexity for searching a key in a balanced Binary Search Tree (BST)?',
        points: 10,
        options: [
          { id: 'opt1', text: 'O(1)' },
          { id: 'opt2', text: 'O(log N)' },
          { id: 'opt3', text: 'O(N)' },
          { id: 'opt4', text: 'O(N log N)' },
        ],
        correctOptionId: 'opt2',
        explanation: 'In a balanced BST, tree height is logarithmic with respect to N nodes, so search is O(log N).',
      },
      {
        id: 'q2',
        questionText: 'Which data structure follows the Last-In, First-Out (LIFO) principle?',
        points: 10,
        options: [
          { id: 'opt1', text: 'Queue' },
          { id: 'opt2', text: 'LinkedList' },
          { id: 'opt3', text: 'Stack' },
          { id: 'opt4', text: 'Heap' },
        ],
        correctOptionId: 'opt3',
        explanation: 'A Stack processes element push/pop operations in LIFO order.',
      },
      {
        id: 'q3',
        questionText: 'What collision resolution technique uses linked lists inside hash table buckets?',
        points: 15,
        options: [
          { id: 'opt1', text: 'Linear Probing' },
          { id: 'opt2', text: 'Separate Chaining' },
          { id: 'opt3', text: 'Quadratic Probing' },
          { id: 'opt4', text: 'Double Hashing' },
        ],
        correctOptionId: 'opt2',
        explanation: 'Separate chaining stores colliding entries in a linked list per bucket.',
      },
      {
        id: 'q4',
        questionText: 'What is the worst-case space complexity of Quicksort algorithm without optimization?',
        points: 15,
        options: [
          { id: 'opt1', text: 'O(N)' },
          { id: 'opt2', text: 'O(1)' },
          { id: 'opt3', text: 'O(log N)' },
          { id: 'opt4', text: 'O(N^2)' },
        ],
        correctOptionId: 'opt1',
        explanation: 'The call stack for recursive quicksort can grow up to O(N) depth in the worst case.',
      },
    ],
  },
  {
    id: 'asg-102',
    title: 'Data Science Exploratory Analysis Report',
    type: 'assignment',
    subject: 'Data Science & Analytics',
    dueDate: '2026-08-22',
    dueDateFormatted: 'Aug 22, 2026 (In 9 Days)',
    points: 80,
    status: 'pending',
    instructions:
      'Perform exploratory data analysis on the healthcare dataset. Include histograms, correlation heatmaps, and outlier detection summary.',
    attachments: [
      { name: 'Healthcare_Dataset_2026.csv', sizeFormatted: '8.1 MB', type: 'csv' },
    ],
  },
  {
    id: 'quiz-202',
    title: 'Deep Learning Backpropagation & Gradient Descent Quiz',
    type: 'quiz',
    subject: 'Advanced AI & Deep Learning',
    dueDate: '2026-08-10',
    dueDateFormatted: 'Aug 10, 2026 (Completed)',
    points: 40,
    status: 'graded',
    instructions:
      'Assessment of activation functions (ReLU, Sigmoid, Softmax) and Adam optimizer parameters.',
    submission: {
      submittedAt: 'Aug 10, 2026, 04:30 PM',
      files: [],
      grade: {
        score: 38,
        maxScore: 40,
        feedback: 'Excellent work! 95% score on backpropagation derivatives.',
      },
    },
  },
  {
    id: 'asg-103',
    title: 'Convolutional Neural Network Image Classifier Submission',
    type: 'assignment',
    subject: 'Computer Vision',
    dueDate: '2026-08-05',
    dueDateFormatted: 'Aug 05, 2026 (Turned In)',
    points: 100,
    status: 'submitted',
    instructions:
      'Train a ResNet-18 architecture on CIFAR-10 dataset achieving at least 85% test accuracy.',
    submission: {
      submittedAt: 'Aug 05, 2026, 11:10 AM',
      files: [
        { name: 'CNN_CIFAR10_ResNet.ipynb', sizeFormatted: '3.6 MB', type: 'ipynb' },
        { name: 'model_weights.pth', sizeFormatted: '44.8 MB', type: 'weights' },
      ],
      textNote: 'Achieved 88.4% accuracy on validation set after 30 epochs.',
    },
  },
];

export function getAssignmentFilterTabs(totalCount: number, pendingCount: number) {
  return [
    { id: 'all', label: `All Work (${totalCount})` },
    { id: 'assignments', label: 'Assignments' },
    { id: 'quizzes', label: 'Quizzes' },
    { id: 'pending', label: `To Do (${pendingCount})` },
    { id: 'submitted', label: 'Turned In' },
    { id: 'graded', label: 'Graded' },
  ];
}

export const ASSIGNMENT_SUBJECT_OPTIONS = [
  'Computer Science',
  'Advanced AI & Deep Learning',
  'Data Science & Analytics',
  'Computer Vision',
  'Mathematics & Physics',
];
