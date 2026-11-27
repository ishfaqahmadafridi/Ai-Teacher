import type { AnatomyPartMaterial } from '../types/visual.types';

/**
 * Map a mesh to a lesson part. The mesh or any ancestor group must be named exactly
 * the part ID; only exporter numbering (".001" → "001", "_1") may follow. Looser
 * prefixes would mis-highlight anatomy, e.g. "spine_of_scapula" is not the spine.
 */
export function anatomyPartForNames(names: readonly string[], partIds: readonly string[]): string | undefined {
  for (const name of names) {
    const normalized = name.trim().toLowerCase().replace(/[\s.-]+/g, '_');
    const match = partIds.find(id => {
      if (!normalized.startsWith(id)) return false;
      const suffix = normalized.slice(id.length);
      return /^_?\d*$/.test(suffix);
    });
    if (match) return match;
  }
  return undefined;
}

/**
 * Tint and glow only the taught part (a glow alone washes out on blue/dark tissue);
 * every other owned material returns to its exported colour.
 */
export function applyAnatomyFocus(materials: readonly AnatomyPartMaterial[], focus: string | undefined, color: string, intensity: number, noGlow: string) {
  for (const { part, material, baseColor } of materials) {
    const active = !!focus && part === focus;
    material.color.set(active ? color : baseColor);
    material.emissive.set(active ? color : noGlow);
    material.emissiveIntensity = active ? intensity : 0;
  }
}

/** Arrange part labels in a simple grid (0..1 coordinates) for the 2D fallback schematic. */
export function anatomyFallbackPosition(index: number, columns: number, spacing: number) {
  return { x: (index % columns) * spacing, y: Math.floor(index / columns) * spacing };
}
