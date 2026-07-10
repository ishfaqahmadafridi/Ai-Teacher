import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ClassroomState, ExtendedChunk, DiagramCommand, DiagramType, SerializedVoice } from '@/types';

const initialState: ClassroomState = {
  inputText: '',
  loading: false,
  loadingStatus: '',
  error: null,
  chunks: [],
  diagramType: 'default',
  currentCommand: null,
  currentFormula: null,
  voices: [],
  selectedVoice: '',
  chalkboardPoints: [],
  teacherPosition: 'left',
  isWritingOnBoard: false,
  isPaused: false,
  topic: '',
  isPlaying: false,
  currentChunkIndex: -1,
  spokenText: '',
  isListening: false,
  voiceError: null,
};

const classroomSlice = createSlice({
  name: 'classroom',
  initialState,
  reducers: {
    setInputText(state, action: PayloadAction<string>) {
      state.inputText = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setLoadingStatus(state, action: PayloadAction<string>) {
      state.loadingStatus = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setChunks(state, action: PayloadAction<ExtendedChunk[]>) {
      state.chunks = action.payload;
    },
    setDiagramType(state, action: PayloadAction<DiagramType>) {
      state.diagramType = action.payload;
    },
    setCurrentCommand(state, action: PayloadAction<DiagramCommand | null>) {
      state.currentCommand = action.payload;
    },
    setCurrentFormula(state, action: PayloadAction<string | null>) {
      state.currentFormula = action.payload;
    },
    setVoices(state, action: PayloadAction<SerializedVoice[]>) {
      state.voices = action.payload;
    },
    setSelectedVoice(state, action: PayloadAction<string>) {
      state.selectedVoice = action.payload;
    },
    setChalkboardPoints(state, action: PayloadAction<string[]>) {
      state.chalkboardPoints = action.payload;
    },
    addChalkboardPoint(state, action: PayloadAction<string>) {
      state.chalkboardPoints.push(action.payload);
    },
    setTeacherPosition(state, action: PayloadAction<'left' | 'right' | 'center'>) {
      state.teacherPosition = action.payload;
    },
    setIsWritingOnBoard(state, action: PayloadAction<boolean>) {
      state.isWritingOnBoard = action.payload;
    },
    setIsPaused(state, action: PayloadAction<boolean>) {
      state.isPaused = action.payload;
    },
    setTopic(state, action: PayloadAction<string>) {
      state.topic = action.payload;
    },
    setIsPlaying(state, action: PayloadAction<boolean>) {
      state.isPlaying = action.payload;
    },
    setCurrentChunkIndex(state, action: PayloadAction<number>) {
      state.currentChunkIndex = action.payload;
    },
    setSpokenText(state, action: PayloadAction<string>) {
      state.spokenText = action.payload;
    },
    setIsListening(state, action: PayloadAction<boolean>) {
      state.isListening = action.payload;
    },
    setVoiceError(state, action: PayloadAction<string | null>) {
      state.voiceError = action.payload;
    },
    resetClassroomState(state) {
      Object.assign(state, {
        ...initialState,
        voices: state.voices,
        selectedVoice: state.selectedVoice,
      });
    },
  },
});

export const {
  setInputText,
  setLoading,
  setLoadingStatus,
  setError,
  setChunks,
  setDiagramType,
  setCurrentCommand,
  setCurrentFormula,
  setVoices,
  setSelectedVoice,
  setChalkboardPoints,
  addChalkboardPoint,
  setTeacherPosition,
  setIsWritingOnBoard,
  setIsPaused,
  setTopic,
  setIsPlaying,
  setCurrentChunkIndex,
  setSpokenText,
  setIsListening,
  setVoiceError,
  resetClassroomState,
} = classroomSlice.actions;

export default classroomSlice.reducer;
