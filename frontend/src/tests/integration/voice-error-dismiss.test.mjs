import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from './helpers/loadModule.mjs';

test('dismissing the error banner clears voice and general errors', () => {
  const actions = [];
  const local = [];
  const { useInputBar } = load('features/classroom/hooks/useInputBar.ts', {
    react: { useEffect() {}, useCallback: fn => fn, useRef: current => ({ current }), useState: initial => [initial, value => local.push(value)] },
    '@/hooks/useAppStore': { useAppDispatch: () => action => actions.push(action), useAppSelector: selector => selector({ classroom: { voiceError: 'Voice error: not-allowed', chunks: [] } }) },
    '@/features/classroom/state/classroomSlice': {
      setError: payload => ({ type: 'error', payload }), setVoiceError: payload => ({ type: 'voiceError', payload }),
    },
    './useVoiceInput': { useVoiceInput: () => ({}) },
    './useChunkPlayer': { useChunkPlayer: () => ({}) },
    './useClassroomApi': { useClassroomApi: () => ({}) },
    '../services/lectureNotesService': { lectureNotesService: {} },
  });
  useInputBar().clearErrors();
  assert.deepEqual(actions, [{ type: 'error', payload: null }, { type: 'voiceError', payload: null }]);
  assert.deepEqual(local, [null]);
});
