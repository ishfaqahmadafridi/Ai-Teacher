import { Vector3, Quaternion, Euler } from 'three';
import { CONCEPTUAL_COLORS as colors, MOLECULE_ATOMS, ELEMENT_COLORS, ELEMENT_LABELS } from '../constants/conceptualVisualConstants';
import type { AssemblyVisual, ConceptualPart, VisualVector } from '../types/visual.types';

export function connectorPart(id: string, label: string, start: VisualVector, end: VisualVector): ConceptualPart {
  const from = new Vector3(...start), to = new Vector3(...end), direction = to.clone().sub(from);
  const rotation = new Euler().setFromQuaternion(new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), direction.clone().normalize()));
  return { id, label, shape: 'cylinder', position: from.add(to).multiplyScalar(0.5).toArray(), size: [0.06, direction.length(), 0.06], rotation: [rotation.x, rotation.y, rotation.z], color: colors.bond };
}

export function conceptualParts(visual: AssemblyVisual): ConceptualPart[] {
  const box = (id: string, label: string, position: VisualVector, size: VisualVector, color = colors.structure): ConceptualPart => ({ id, label, shape: 'box', position, size, color });
  if (visual.model === 'bridge' || visual.model === 'beam') {
    const supports = [box('left_support', 'Left support', [-2, -0.8, 0], [0.4, 1.6, 1]), box('right_support', 'Right support', [2, -0.8, 0], [0.4, 1.6, 1])];
    if (visual.model === 'beam') return [box('beam', 'Beam', [0, 0, 0], [4.6, 0.25, 0.6]), ...supports, box('load', 'Illustrative load', [0, 0.6, 0], [0.6, 0.8, 0.6], colors.moving)];
    return [box('deck', 'Deck', [0, 0, 0], [5, 0.25, 1.5]), ...supports,
      connectorPart('left_brace', 'Left brace', [-2, 0.2, 0], [0, 1.6, 0]), connectorPart('right_brace', 'Right brace', [0, 1.6, 0], [2, 0.2, 0])];
  }
  if (visual.model === 'piston') {
    const y = -0.5 + (visual.phase ?? 0.5);
    return [box('cylinder', 'Cylinder cutaway', [0, 0.25, -0.6], [1.8, 2.5, 0.3]),
      { id: 'piston', label: 'Piston', shape: 'cylinder', position: [0, y, 0], size: [0.65, 0.4, 0.65], color: colors.moving },
      connectorPart('rod', 'Piston rod', [0, y - 0.2, 0], [0, y - 1.5, 0])];
  }
  if (visual.model === 'pulley') return [
    { id: 'wheel', label: 'Fixed pulley wheel', shape: 'torus', position: [0, 0.8, 0], size: [0.7, 0.15, 0], color: colors.moving },
    { id: 'axle', label: 'Axle', shape: 'sphere', position: [0, 0.8, 0], size: [0.12, 0, 0], color: colors.support },
    box('rope', 'Rope', [0.85, -0.2, 0], [0.06, 2, 0.06]),
    box('rope', 'Rope', [-0.85, -0.2, 0], [0.06, 2, 0.06]),
    { id: 'rope', label: 'Rope', shape: 'torus', position: [0, 0.8, 0], size: [0.85, 0.03, Math.PI], color: colors.structure },
    box('load', 'Load', [0.85, -1.45, 0], [0.7, 0.5, 0.5]),
  ];
  const atoms = MOLECULE_ATOMS[visual.molecule ?? 'water'];
  const parts: ConceptualPart[] = atoms.map((atom, index) => ({ id: `atom_${index}`, label: `${ELEMENT_LABELS[atom.element]} (${atom.element})`, shape: 'sphere', position: [...atom.position], size: [atom.element === 'H' ? 0.18 : 0.3, 0, 0], color: ELEMENT_COLORS[atom.element] }));
  atoms.slice(1).forEach((atom) => parts.push(connectorPart('bonds', 'Bond framework (bond order omitted)', [0, 0, 0], [...atom.position])));
  return parts;
}
