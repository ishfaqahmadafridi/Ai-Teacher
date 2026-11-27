/**
 * Fixed configuration for the built-in physics and chemistry 3D scenes.
 * Values were moved unchanged out of the scene components so components stay presentational
 * and every scene shares one palette, one title style and one speed vocabulary.
 */
import type { Vec3 } from '../types/board.types';

/** Shared scene palette (labels, ground and axis lines). */
export const SCENE_COLORS = {
  title: '#94a3b8',
  ground: '#334155',
  axis: '#475569',
  muted: '#64748b',
} as const;

/** Every scene title sits below the drawing at the same place and size. */
export const SCENE_TITLE = { position: [0, -3.2, 0] as Vec3, fontSize: 0.22 } as const;

/** Lesson `speed` command → playback multiplier, per scene (they were tuned separately). */
export const GRAVITY_SPEED = { slow: 0.5, normal: 1, fast: 1.5 } as const;
export const PROJECTILE_SPEED = { slow: 0.5, normal: 0.9, fast: 1.4 } as const;

export const WAVE_DEFAULTS = {
  resolution: 80,
  width: 8,
  amplitude: 1.3,
  frequency: 2.0,
  speed: 2.5,
  color: '#a78bfa',
} as const;

/** Free fall drawn as y = startY − ½·g·t²·timeScale, restarted each cycle or on reaching the ground. */
export const FREE_FALL = {
  gravity: 9.8,
  startY: 2.5,
  groundY: -2.2,
  cycleSeconds: 2.5,
  timeScale: 0.1,
  trailSamples: 20,
  trailStep: 0.24,
  titleFontSize: 0.24,
  arrow: { direction: [0, -1, 0] as Vec3, origin: [0, 1, 0] as Vec3, length: 1.2, color: 0xf59e0b, headLength: 0.2, headWidth: 0.12 },
} as const;

/** 45° launch scaled into the view; origin is the launch point in world units. */
export const PROJECTILE = {
  gravity: 9.8,
  initialSpeed: 8,
  angle: Math.PI / 4,
  scale: 0.35,
  origin: [-3, -2] as const,
  arcSamples: 60,
  arrows: [
    { direction: [1, 0, 0] as Vec3, color: 0x22d3ee },
    { direction: [0, 1, 0] as Vec3, color: 0x4ade80 },
  ],
  arrowLength: 0.8,
  arrowHead: { length: 0.15, width: 0.1 },
} as const;

/** Dipole drawn as cubic Bézier field lines from +q to −q. */
export const ELECTRIC_DIPOLE = {
  chargeX: 1.8,
  lineCount: 12,
  stepsPerLine: 30,
  flare: 1.5,
} as const;

/** Materials and sizes drawn by each scene (sphere args are radius, width and height segments). */
export const GRAVITY_LOOK = {
  ball: { args: [0.28, 32, 32] as Vec3, color: '#7c3aed', roughness: 0.3, metalness: 0.5 },
  groundHalfWidth: 3,
  ballLabel: { offsetX: 0.6, fontSize: 0.22, color: '#a78bfa' },
  groundLabel: { position: [-2.5, -2.5, 0] as Vec3, fontSize: 0.2 },
} as const;

export const PROJECTILE_LOOK = {
  arcColor: '#6366f1',
  ball: { args: [0.22, 32, 32] as Vec3, color: '#f59e0b', roughness: 0.3 },
  groundHalfWidth: 3.2,
  labelFontSize: 0.2,
  componentLabelPosition: [-2.5, -2.7, 0] as Vec3,
  equationLabelPosition: [0, 1.8, 0] as Vec3,
} as const;

export const WAVE_LOOK = { titlePosition: [0, 2.4, 0] as Vec3, axisWidth: 1, waveWidth: 2.5 } as const;

export const ATOM_LOOK = {
  nucleus: { args: [0.28, 32, 32] as Vec3, color: '#f59e0b', emissiveIntensity: 0.4 },
  nucleusLabel: { position: [0.4, 0.1, 0] as Vec3, fontSize: 0.18, color: '#fbbf24' },
  ring: { tube: 0.015, radialSegments: 8, tubularSegments: 64, opacity: 0.4 },
  electron: { args: [0.1, 16, 16] as Vec3, emissiveIntensity: 0.5 },
} as const;

export const ELECTRIC_FIELD_LOOK = {
  line: { color: '#38bdf8', width: 1.2, opacity: 0.6 },
  charge: { args: [0.22, 32, 32] as Vec3, roughness: 0.3, labelOffsetY: 0.4, labelFontSize: 0.2 },
  positive: { color: '#ef4444', labelColor: '#fca5a5', label: '+q (Source)' },
  negative: { color: '#3b82f6', labelColor: '#93c5fd', label: '-q (Sink)' },
} as const;
