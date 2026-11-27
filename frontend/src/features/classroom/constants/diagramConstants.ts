/** Supported playback commands shared by runtime validation and TypeScript. */
export const DIAGRAM_ACTIONS = [
  'none', 'highlight', 'rotate', 'zoom', 'zoom_in', 'zoom_out',
  'show_formula', 'show_formula_stepwise', 'show_initial', 'add_arrow',
  'add_label', 'pause_and_highlight', 'pause_and_explain',
] as const;

/**
 * Self-hosted label font for 3D diagram text. Without it the 3D text component downloads
 * fonts from a public CDN mid-lecture, which stalls scenes on slow or filtered networks.
 * Subset of DejaVu Sans (free licence) covering Latin, Greek, sub/superscripts and maths symbols.
 */
export const DIAGRAM_LABEL_FONT = '/classroom-assets/fonts/diagram-labels.ttf';

/** World-space half extents every physics/chemistry scene draws within, labels included (titles sit at y = -3.2). */
export const DIAGRAM_VIEW_BOUNDS = { halfWidth: 3.1, halfHeight: 3.6 };
