import type { ExtendedChunk, DiagramType } from '@/types';
export interface ClassroomAnswer {
  chunks: ExtendedChunk[];
  topic: string;
  diagram_type: DiagramType;
  language: string;
}
export interface ClassroomQuestion { question: string; sessionId: string; signal?: AbortSignal }
export interface ClassroomHealth { status: string; model: string; rag: { active: boolean; dataset: string; status: string } }
