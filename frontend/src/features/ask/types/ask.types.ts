export type AskRole = 'user' | 'assistant';

export interface AskMessage {
  id: string;
  role: AskRole;
  content: string;
}
