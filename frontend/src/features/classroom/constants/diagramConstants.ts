/** Supported playback commands shared by runtime validation and TypeScript. */
export const DIAGRAM_ACTIONS = [
  'none', 'highlight', 'rotate', 'zoom', 'zoom_in', 'zoom_out',
  'show_formula', 'show_formula_stepwise', 'show_initial', 'add_arrow',
  'add_label', 'pause_and_highlight', 'pause_and_explain',
] as const;
