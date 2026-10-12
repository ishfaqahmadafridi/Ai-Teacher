export interface NoteSection {
  key_point: string;
  explanation: string;
  formula: string;
  annotation: string;
  image_source?: string;
}
export interface SavedLectureNote {
  id: string;
  version: string;
  created_at?: string;
  title: string;
  language: string;
  source_language: string;
  direction: 'ltr' | 'rtl';
  sections: NoteSection[];
  figure_indices: number[];
  sources: { title: string; url: string; number: number }[];
  extra_llm_tokens: number;
}
export interface NoteFigurePreviewProps { noteId: string; index: number; caption: string }
