import { Box2, Vector2 } from 'three';
import { SCHEMATIC_BOUNDS as bounds } from '../constants/conceptualVisualConstants';
import type { SchematicVisual, SchematicLayoutNode } from '../types/visual.types';

/** Preserve valid placements; use a bounded grid when model coordinates collide. */
export function schematicLayout(visual: SchematicVisual): SchematicLayoutNode[] {
  const width = bounds.width - bounds.padding * 2;
  const height = bounds.height - bounds.padding * 2;
  const nodes = visual.nodes.map(node => ({ ...node,
    px: bounds.padding + node.x * width,
    py: bounds.padding + node.y * height,
  }));
  const boxes = nodes.map(node => new Box2().setFromCenterAndSize(
    new Vector2(node.px, node.py), new Vector2(bounds.nodeWidth + bounds.gap, bounds.nodeHeight + bounds.gap)));
  if (!boxes.some((box, index) => boxes.slice(index + 1).some(other => box.intersectsBox(other)))) return nodes;
  const columns = Math.ceil(Math.sqrt(nodes.length));
  const rows = Math.ceil(nodes.length / columns);
  return nodes.map((node, index) => ({ ...node,
    px: bounds.padding + (columns > 1 ? (index % columns) * width / (columns - 1) : width / 2),
    py: bounds.padding + (rows > 1 ? Math.floor(index / columns) * height / (rows - 1) : height / 2),
  }));
}
