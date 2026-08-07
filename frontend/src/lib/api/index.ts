import './interceptors'; // Ensures interceptors are registered

export { apiClient, BASE_URL } from './client';
export { createSSEStream } from './sse';
export { askQuestion, explainTopic } from './physicsApi';
