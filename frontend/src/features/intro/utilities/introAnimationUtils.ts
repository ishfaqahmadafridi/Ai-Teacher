import type { Particle } from '../types/intro.types';

export function createRandomParticle(width: number, height: number): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 1.8 + 0.6,
    alpha: Math.random() * 0.5 + 0.1,
    alphaDir: Math.random() > 0.5 ? 0.003 : -0.003,
  };
}

export function updateParticle(p: Particle, width: number, height: number): Particle {
  let nextX = p.x + p.vx;
  let nextY = p.y + p.vy;

  if (nextX < 0) nextX = width;
  if (nextX > width) nextX = 0;
  if (nextY < 0) nextY = height;
  if (nextY > height) nextY = 0;

  let nextAlpha = p.alpha + p.alphaDir;
  let nextAlphaDir = p.alphaDir;

  if (nextAlpha >= 0.7 || nextAlpha <= 0.1) {
    nextAlphaDir = -nextAlphaDir;
  }

  return {
    ...p,
    x: nextX,
    y: nextY,
    alpha: Math.max(0.05, Math.min(0.75, nextAlpha)),
    alphaDir: nextAlphaDir,
  };
}
