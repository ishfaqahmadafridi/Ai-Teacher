import classroomReducer, {
  setInputText,
  setLoading,
  setTopic,
  setDiagramType,
  resetClassroomState,
} from '../state/classroomSlice';

describe('Redux Slice — classroomSlice', () => {
  const getInitialState = () => classroomReducer(undefined, { type: '@@INIT' });

  it('should return the initial state', () => {
    const state = getInitialState();
    expect(state.inputText).toBe('');
    expect(state.loading).toBe(false);
    expect(state.diagramType).toBe('default');
    expect(state.chalkboardPoints).toEqual([]);
  });

  it('should handle setInputText', () => {
    const prevState = getInitialState();
    const action = setInputText('How does momentum conserve?');
    const state = classroomReducer(prevState, action);
    expect(state.inputText).toBe('How does momentum conserve?');
  });

  it('should handle setLoading', () => {
    const prevState = getInitialState();
    const action = setLoading(true);
    const state = classroomReducer(prevState, action);
    expect(state.loading).toBe(true);
  });

  it('should handle setTopic', () => {
    const prevState = getInitialState();
    const action = setTopic('Classical Mechanics');
    const state = classroomReducer(prevState, action);
    expect(state.topic).toBe('Classical Mechanics');
  });

  it('should handle setDiagramType', () => {
    const prevState = getInitialState();
    const action = setDiagramType('projectile');
    const state = classroomReducer(prevState, action);
    expect(state.diagramType).toBe('projectile');
  });

  it('should handle resetClassroomState', () => {
    const stateWithData = classroomReducer(
      getInitialState(),
      setInputText('test input')
    );
    const resetState = classroomReducer(stateWithData, resetClassroomState());
    expect(resetState.inputText).toBe('');
    expect(resetState.loading).toBe(false);
  });
});
