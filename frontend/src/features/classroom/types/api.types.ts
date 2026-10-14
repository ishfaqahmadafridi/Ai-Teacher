import type { ExtendedChunk, DiagramType } from '@/types';
export interface ClassroomAnswer {
  model_info?: { note_id?: string };
  chunks: ExtendedChunk[];
  topic: string;
  diagram_type: DiagramType;
  language: string;
}
export interface ClassroomQuestion { question: string; sessionId: string; signal?: AbortSignal; onStatus?: (status: string) => void }
export interface ClassroomHealth { status: string; model: string; rag: { active: boolean; dataset: string; status: string } }
