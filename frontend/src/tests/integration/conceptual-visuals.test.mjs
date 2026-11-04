import assert from 'node:assert/strict';
import { test } from 'node:test';
import { load } from './helpers/loadModule.mjs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const constants = load('features/classroom/constants/conceptualVisualConstants.ts');
const schemas = load('features/classroom/validators/conceptualVisual.schema.ts');
const { conceptualParts } = load('features/classroom/utilities/conceptualGeometry.ts');
const schematic = { kind: 'schematic', title: 'Logic', nodes: [
  { id: 'a', label: 'Input', x: 0.1, y: 0.5 }, { id: 'b', label: 'Output', x: 0.9, y: 0.5 },
], edges: [{ source: 'a', target: 'b' }], focus: 'b' };
const react = { useMemo: fn => fn(), useId: () => ':test:' };

test('schematics validate finite bounded positions, unique IDs and edge/focus references', () => {
  assert.equal(schemas.schematicVisualSchema.safeParse(schematic).success, true);
  for (const value of [
    { ...schematic, focus: 'missing' },
    { ...schematic, nodes: [schematic.nodes[0], schematic.nodes[0]] },
    { ...schematic, edges: [{ source: 'a', target: 'missing' }] },
    { ...schematic, edges: [schematic.edges[0], schematic.edges[0]] },
    { ...schematic, nodes: [{ ...schematic.nodes[0], x: NaN }] },
  ]) assert.equal(schemas.schematicVisualSchema.safeParse(value).success, false);
});

test('all approved builder parts have finite geometry and matching registered IDs', () => {
  for (const model of ['bridge', 'beam', 'piston', 'pulley']) {
    for (const phase of [0, 0.5, 1]) {
      const parts = conceptualParts({ kind: 'assembly', model, phase });
      assert.equal(schemas.assemblyVisualSchema.safeParse({ kind: 'assembly', model, phase }).success, true);
      assert.deepEqual(new Set(parts.map(part => part.id)), new Set(constants.ASSEMBLY_PART_IDS[model]));
      for (const part of parts) assert.ok([...part.position, ...part.size, ...(part.rotation ?? [])].every(Number.isFinite));
    }
  }
});

test('molecules preserve element counts and bounded atom selection', () => {
  for (const [molecule, atoms] of Object.entries(constants.MOLECULE_ATOMS)) {
    const visual = { kind: 'assembly', model: 'molecule', molecule };
    const parts = conceptualParts(visual);
    assert.equal(parts.filter(part => part.id.startsWith('atom_')).length, atoms.length);
    assert.equal(parts.filter(part => part.id === 'bonds').length, atoms.length - 1);
    assert.equal(schemas.assemblyVisualSchema.safeParse({ ...visual, focus: `atom_${atoms.length}` }).success, false);
    assert.equal(schemas.assemblyVisualSchema.safeParse({ ...visual, focus: 'bonds' }).success, true);
  }
});

test('pulley rope wraps over the wheel and meets the hanging load', () => {
  const parts = conceptualParts({ kind: 'assembly', model: 'pulley', focus: 'rope' });
  const rope = parts.filter(part => part.id === 'rope');
  const arc = rope.find(part => part.shape === 'torus');
  const ends = rope.filter(part => part.shape === 'box');
  const load = parts.find(part => part.id === 'load');
  assert.equal(rope.length, 3);
  assert.equal(ends.length, 2);
  assert.equal(arc.size[2], Math.PI);
  for (const end of ends) {
    assert.ok(Math.abs(end.position[1] + end.size[1] / 2 - arc.position[1]) < 1e-9);
    assert.equal(Math.abs(end.position[0] - arc.position[0]), arc.size[0]);
  }
  const loadedEnd = ends.find(end => end.position[0] === load.position[0]);
  assert.ok(Math.abs(loadedEnd.position[1] - loadedEnd.size[1] / 2 - (load.position[1] + load.size[1] / 2)) < 1e-9);
});

test('unsupported visual data is dropped without rejecting a classroom response', () => {
  const { classroomAnswerSchema } = load('features/classroom/validators/classroom.schema.ts');
  const response = classroomAnswerSchema.parse({ topic: 'Heart', language: 'en', diagram_type: 'default',
    chunks: [{ speak: 'The heart pumps blood.', diagram: { action: 'none', visual: { kind: 'assembly', model: 'heart' } } }] });
  assert.equal(response.chunks[0].diagram.visual, undefined);
  assert.equal(response.chunks[0].speak, 'The heart pumps blood.');
});

test('schematic layout terminates arrows on node borders', () => {
  const { useSchematicVisual } = load('features/classroom/hooks/useSchematicVisual.ts', { react });
  const result = useSchematicVisual(schematic);
  assert.ok(result.edges[0].x1 > result.nodes[0].px);
  assert.ok(result.edges[0].x2 < result.nodes[1].px);
  assert.ok(result.edges[0].x1 < result.edges[0].x2);
});

test('colliding schematic nodes receive distinct grid positions without changing IDs or focus', () => {
  const { schematicLayout } = load('features/classroom/utilities/schematicLayout.ts');
  const visual = { ...schematic, nodes: Array.from({ length: 12 }, (_, i) => ({ id: `n${i}`, label: `Part ${i}`, x: 0.5, y: 0.5 })), focus: 'n3' };
  const nodes = schematicLayout(visual);
  assert.deepEqual(Array.from(nodes, node => node.id), visual.nodes.map(node => node.id));
  assert.equal(visual.focus, 'n3');
  for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
    assert.ok(Math.abs(nodes[i].px - nodes[j].px) >= constants.SCHEMATIC_BOUNDS.nodeWidth || Math.abs(nodes[i].py - nodes[j].py) >= constants.SCHEMATIC_BOUNDS.nodeHeight);
  }
});

test('well separated schematic coordinates and single-node placement are preserved', () => {
  const { schematicLayout } = load('features/classroom/utilities/schematicLayout.ts');
  const nodes = schematicLayout(schematic);
  assert.equal(nodes[0].px, constants.SCHEMATIC_BOUNDS.padding + 0.1 * (constants.SCHEMATIC_BOUNDS.width - constants.SCHEMATIC_BOUNDS.padding * 2));
  assert.equal(schematicLayout({ ...schematic, nodes: [schematic.nodes[0]], edges: [] }).length, 1);
});

test('image fallback metadata survives frontend validation', () => {
  const { classroomAnswerSchema } = load('features/classroom/validators/classroom.schema.ts');
  const answer = classroomAnswerSchema.parse({ topic: 'Process', language: 'en', diagram_type: 'default', chunks: [
    { speak: 'Observe this simplified process.', diagram: { action: 'none', visual: schematic, visual_status: 'fallback', visual_reason: 'no_usable_asset' } },
  ] });
  assert.equal(answer.chunks[0].diagram.visual_status, 'fallback');
});

test('assembly fallback deduplicates bond groups and preserves selected part', () => {
  const { useAssemblyVisual } = load('features/classroom/hooks/useAssemblyVisual.ts', {
    react: { ...react, useState: initialize => [initialize()] },
    'three/addons/capabilities/WebGL.js': { default: { isWebGL2Available: () => false } },
  });
  const result = useAssemblyVisual({ kind: 'assembly', model: 'molecule', molecule: 'methane', focus: 'bonds' });
  assert.equal(result.uniqueParts.length, 6);
  assert.equal(result.fallback.focus, 'bonds');
  assert.equal(schemas.schematicVisualSchema.safeParse(result.fallback).success, true);
});

for (const supported of [false, true]) {
  test(`assembly detects WebGL2 support as ${supported} without mounting a failing canvas`, () => {
    const { useAssemblyVisual } = load('features/classroom/hooks/useAssemblyVisual.ts', {
      react: { ...react, useState: initialize => [initialize()] },
      'three/addons/capabilities/WebGL.js': { default: { isWebGL2Available: () => supported } },
    });
    assert.equal(useAssemblyVisual({ kind: 'assembly', model: 'bridge' }).webGLAvailable, supported);
  });
}

test('schematic renders accessible SVG labels and focused part', () => {
  const { SchematicVisual } = load('features/classroom/components/board/diagram/SchematicVisual.tsx');
  const markup = renderToStaticMarkup(createElement(SchematicVisual, { visual: schematic }));
  assert.ok(markup.includes('aria-label="Logic"'));
  assert.ok(markup.includes('data-visual-part="b"'));
  assert.ok(markup.includes('stroke-width="4"'));
  assert.ok(markup.includes('marker-end='));
});
