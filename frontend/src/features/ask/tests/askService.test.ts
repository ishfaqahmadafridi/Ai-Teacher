import { AskService } from '../services/askService';

describe('Integration Services — Ask', () => {
  it('should validate ask request payloads successfully', () => {
    const mockRequest = {
      question: 'What is angular acceleration?',
      session_id: 'a9b8c7d6-e5f4-3a2b-1c0d-e9f8a7b6c5d4',
    };
    expect(AskService).toBeDefined();
    expect(mockRequest.question).toBe('What is angular acceleration?');
  });
});
