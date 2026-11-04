import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from './helpers/loadModule.mjs';

test('formula parsing remains pure and preserves equation characters and token categories', () => {
  const { tokenizeFormula } = load('features/classroom/utilities/formulaUtils.ts');
  const formula = 'F = m * (9.8 + a)';
  const tokens = tokenizeFormula(formula);
  assert.equal(tokens.map(token => token.text).join(''), formula);
  assert.match(tokens.find(token => token.text === '=').className, /font-bold/);
  assert.match(tokens.find(token => token.text === '9.8').className, /formula-number/);
  assert.equal(tokenizeFormula('').length, 0);
});

test('mobile sidebar hook preserves Escape, topic selection, question callbacks and cleanup', () => {
  let handler;
  let removed = false;
  let closed = 0;
  let selected;
  let asked;
  const documentStub = { addEventListener(name, callback) { this.listener = callback; }, removeEventListener() { removed = true; } };
  const { useMobileClassroomSidebar } = load('features/classroom/hooks/useMobileClassroomSidebar.ts', {
    react: { useCallback: callback => callback, useEffect: effect => { handler = effect(); } },
    './useMobileSidebar': { useMobileSidebar: () => ({ isOpen: true, handleClose: () => { closed++; } }) },
    './useClassroomSidebar': { useClassroomSidebar: () => ({ handleSelectTopic: id => { selected = id; } }) },
  }, { document: documentStub });
  const panel = useMobileClassroomSidebar(question => { asked = question; });
  panel.selectTopic('topic-1');
  assert.equal(selected, 'topic-1');
  panel.ask('Explain gravity');
  assert.equal(asked, 'Explain gravity');
  assert.equal(closed, 2);
  documentStub.listener({ key: 'Escape' });
  assert.equal(closed, 3);
  handler();
  assert.equal(removed, true);
});

test('in-lecture captions retain their existing close action without the CC toolbar', () => {
  const actions = [];
  const { useSubtitleBar } = load('features/classroom/hooks/useSubtitleBar.ts', {
    react: { useEffect() {}, useRef: value => ({ current: value }) },
    '@/hooks/useAppStore': { useAppDispatch: () => action => actions.push(action), useAppSelector: selector => selector({
      classroom: { showSubtitles: true, isPlaying: true, spokenText: 'Concept explanation', currentChunkIndex: 0 },
    }) },
    '@/features/classroom/state/classroomSlice': { toggleSubtitles: () => ({ type: 'toggleSubtitles' }) },
  });
  const captions = useSubtitleBar();
  assert.equal(captions.isVisible, true);
  captions.hideSubtitles();
  assert.deepEqual(actions, [{ type: 'toggleSubtitles' }]);
});
