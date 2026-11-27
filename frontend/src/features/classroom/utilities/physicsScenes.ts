/**
 * Pure maths for the built-in physics and chemistry scenes (no React, no three.js objects).
 * Each formula exists once here and is shared by the first render and every animation frame.
 */
import { CubicBezierCurve3, Vector3 } from 'three';
import { ELECTRIC_DIPOLE, FREE_FALL, PROJECTILE } from '../constants/physicsSceneConstants';
import type { AtomOrbitConfig } from '../constants/boardConstants';
import type { DiagramCommand } from '../types/classroom.types';
import type { SceneSpeedScale, Vec3, WaveParameters } from '../types/board.types';

/** Map the lesson's `speed` command to a scene's playback multiplier. */
export function sceneSpeed(command: DiagramCommand | null, scale: SceneSpeedScale): number {
  if (command?.speed === 'fast') return scale.fast;
  if (command?.speed === 'slow') return scale.slow;
  return scale.normal;
}

function finiteOr(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

/** Wave amplitude, frequency and speed: lesson command values when valid, otherwise defaults. */
export function waveParameters(command: DiagramCommand | null, defaults: WaveParameters): WaveParameters {
  const custom = command?.animate;
  return {
    amplitude: finiteOr(custom && 'amplitude' in custom ? custom.amplitude : undefined, defaults.amplitude),
    frequency: finiteOr(custom && 'frequency' in custom ? custom.frequency : undefined, defaults.frequency),
    speed: finiteOr(custom?.speed, defaults.speed),
  };
}

/** Points of y = A·sin(kx + phase) across `width`, centred on the origin. */
export function wavePoints(resolution: number, width: number, wave: WaveParameters, phase = 0): Vec3[] {
  const startX = -width / 2;
  return Array.from({ length: resolution }, (_, i) => {
    const x = startX + (i / (resolution - 1)) * width;
    return [x, Math.sin(x * wave.frequency + phase) * wave.amplitude, 0];
  });
}

/** Ball height after `time` seconds of the looping free-fall animation, clamped at the ground. */
export function freeFallHeight(time: number): number {
  const cycle = time % FREE_FALL.cycleSeconds;
  const y = FREE_FALL.startY - 0.5 * FREE_FALL.gravity * cycle * cycle * FREE_FALL.timeScale;
  return Math.max(FREE_FALL.groundY, y);
}

/** Dotted guide below the falling ball. */
export function freeFallTrail(): Vec3[] {
  return Array.from({ length: FREE_FALL.trailSamples }, (_, i) => [0, FREE_FALL.startY - i * FREE_FALL.trailStep, 0]);
}

const launchVelocity = {
  x: PROJECTILE.initialSpeed * Math.cos(PROJECTILE.angle),
  y: PROJECTILE.initialSpeed * Math.sin(PROJECTILE.angle),
};

/** Time from launch until the projectile returns to launch height. */
export const PROJECTILE_FLIGHT_TIME = (2 * launchVelocity.y) / PROJECTILE.gravity;

/** Projectile position `time` seconds after launch, in scene units. */
export function projectilePosition(time: number): Vec3 {
  const [originX, originY] = PROJECTILE.origin;
  return [
    launchVelocity.x * time * PROJECTILE.scale + originX,
    (launchVelocity.y * time - 0.5 * PROJECTILE.gravity * time * time) * PROJECTILE.scale + originY,
    0,
  ];
}

/** Sampled full trajectory, launch to landing. */
export function projectileArc(): Vec3[] {
  const last = PROJECTILE.arcSamples - 1;
  return Array.from({ length: PROJECTILE.arcSamples }, (_, i) => projectilePosition((i / last) * PROJECTILE_FLIGHT_TIME));
}

/** Electron position on its circular orbit at `time` seconds. */
export function orbitPosition({ radius, speed, phaseOffset = 0 }: AtomOrbitConfig, time: number): Vec3 {
  const angle = time * speed + phaseOffset;
  return [Math.cos(angle) * radius, Math.sin(angle) * radius, 0];
}

/** Cubic Bézier field lines (three.js curve) from the positive to the negative charge, flaring by start angle. */
export function dipoleFieldLines(): Vec3[][] {
  const { chargeX, lineCount, stepsPerLine, flare } = ELECTRIC_DIPOLE;
  const source = new Vector3(-chargeX, 0, 0), sink = new Vector3(chargeX, 0, 0);
  return Array.from({ length: lineCount }, (_, line) => {
    const angle = (line / lineCount) * Math.PI * 2;
    const dx = Math.cos(angle) * flare, dy = Math.sin(angle) * flare;
    const curve = new CubicBezierCurve3(source, new Vector3(-chargeX + dx, dy, 0), new Vector3(chargeX - dx, dy, 0), sink);
    return curve.getPoints(stepsPerLine).map(point => point.toArray() as Vec3);
  });
}
