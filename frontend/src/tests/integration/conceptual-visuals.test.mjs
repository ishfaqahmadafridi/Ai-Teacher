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

const anatomy = load('features/classroom/constants/anatomyVisualConstants.ts');
const anatomyParts = load('features/classroom/utilities/anatomyParts.ts');

test('anatomy registry lists unique parts and local GLB assets for every model', () => {
  assert.ok(anatomy.ANATOMY_MODEL_IDS.length > 0);
  for (const id of anatomy.ANATOMY_MODEL_IDS) {
    const entry = anatomy.ANATOMY_MODELS[id];
    assert.ok(entry.title && entry.parts.length > 0);
    assert.ok(entry.asset.startsWith(`${anatomy.ANATOMY_ASSET_ROOT}/`) && entry.asset.endsWith('.glb'));
    assert.equal(new Set(entry.parts.map(part => part.id)).size, entry.parts.length);
  }
});

test('anatomy part IDs match the backend contract the LLM is validated against', async () => {
  const { readFile } = await import('node:fs/promises');
  const source = await readFile(new URL('../../../../backend/django_app/apps/classroom/constants/visuals.py', import.meta.url), 'utf8');
  const block = source.slice(source.indexOf('ANATOMY_PARTS = {'), source.indexOf('}', source.indexOf('ANATOMY_PARTS = {')));
  for (const id of anatomy.ANATOMY_MODEL_IDS) {
    const match = block.match(new RegExp(`'${id}': \\(([^)]*)\\)`));
    assert.ok(match, `backend lists ${id}`);
    const backendParts = [...match[1].matchAll(/'([a-z_]+)'/g)].map(part => part[1]);
    assert.equal(JSON.stringify(backendParts), JSON.stringify(anatomy.ANATOMY_MODELS[id].parts.map(part => part.id)));
  }
});

test('anatomy visuals validate known models and reject invented parts', () => {
  assert.equal(schemas.anatomyVisualSchema.safeParse({ kind: 'anatomy', model: 'heart', focus: 'aorta' }).success, true);
  assert.equal(schemas.anatomyVisualSchema.safeParse({ kind: 'anatomy', model: 'brain' }).success, true);
  for (const value of [{ kind: 'anatomy', model: 'liver' }, { kind: 'anatomy', model: 'heart', focus: 'femur' }]) {
    assert.equal(schemas.anatomyVisualSchema.safeParse(value).success, false);
  }
  const { classroomAnswerSchema } = load('features/classroom/validators/classroom.schema.ts');
  const response = classroomAnswerSchema.parse({ topic: 'Heart', language: 'en', diagram_type: 'default',
    chunks: [{ speak: 'The aorta carries blood.', diagram: { action: 'none', visual: { kind: 'anatomy', model: 'heart', focus: 'aorta' } } }] });
  assert.deepEqual(response.chunks[0].diagram.visual, { kind: 'anatomy', model: 'heart', focus: 'aorta' });
});

test('exported mesh names map to lesson parts despite exporter suffixes', () => {
  const ids = anatomy.ANATOMY_MODELS.heart.parts.map(part => part.id);
  assert.equal(anatomyParts.anatomyPartForNames(['Left_Ventricle.001'], ids), 'left_ventricle');
  assert.equal(anatomyParts.anatomyPartForNames(['mesh_12', 'Aorta', 'Scene'], ids), 'aorta');
  assert.equal(anatomyParts.anatomyPartForNames(['left ventricle 2'], ids), 'left_ventricle');
  assert.equal(anatomyParts.anatomyPartForNames(['aortic_valve', 'Scene'], ids), undefined);
  assert.equal(anatomyParts.anatomyPartForNames(['aorta_wall_mesh', 'Scene'], ids), undefined);
  const skeleton = anatomy.ANATOMY_MODELS.skeleton.parts.map(part => part.id);
  assert.equal(anatomyParts.anatomyPartForNames(['spine_of_scapula'], skeleton), undefined);
  assert.equal(anatomyParts.anatomyPartForNames(['Spine002', 'Skeleton'], skeleton), 'spine');
});

test('anatomy focus glows only the taught part and resets the others', () => {
  const setter = () => ({ set(color) { this.value = color; } });
  const material = () => ({ color: setter(), emissive: setter(), emissiveIntensity: 0, dispose() {} });
  const materials = [{ part: 'aorta', baseColor: '#334499', material: material() },
    { part: 'left_atrium', baseColor: '#aa2233', material: material() }, { baseColor: '#777777', material: material() }];
  anatomyParts.applyAnatomyFocus(materials, 'aorta', '#f59e0b', 0.4, '#000000');
  assert.deepEqual(materials.map(entry => entry.material.emissiveIntensity), [0.4, 0, 0]);
  assert.deepEqual(materials.map(entry => entry.material.color.value), ['#f59e0b', '#aa2233', '#777777']);
  anatomyParts.applyAnatomyFocus(materials, undefined, '#f59e0b', 0.4, '#000000');
  assert.ok(materials.every(entry => entry.material.emissiveIntensity === 0 && entry.material.emissive.value === '#000000'));
  assert.deepEqual(materials.map(entry => entry.material.color.value), ['#334499', '#aa2233', '#777777']);
});

test('anatomy fallback is a valid labelled schematic that keeps the focused part', () => {
  for (const [data, mode, captionPart] of [[undefined, 'checking', anatomy.ANATOMY_ATTRIBUTION], [false, 'fallback', anatomy.ANATOMY_MISSING_TEXT], [true, 'fallback', anatomy.ANATOMY_ATTRIBUTION]]) {
    // Called as a plain function with React mocked, so the hook can run once per case in a loop.
    const { useAnatomyVisual: runAnatomyVisual } = load('features/classroom/hooks/useAnatomyVisual.ts', {
      react: { ...react, useState: initialize => [typeof initialize === 'function' ? initialize() : initialize, () => {}], useEffect: () => {} },
      '@tanstack/react-query': { useQuery: () => ({ data }) },
      'three/addons/capabilities/WebGL.js': { default: { isWebGL2Available: () => false } },
    });
    const result = runAnatomyVisual({ kind: 'anatomy', model: 'brain', focus: 'cerebellum' });
    assert.equal(result.mode, mode, 'without WebGL a ready model still shows the 2D fallback');
    assert.ok(result.caption.endsWith(captionPart));
    assert.match(result.partClassName('cerebellum'), /font-bold/);
    assert.doesNotMatch(result.partClassName('midbrain'), /font-bold/);
    assert.equal(result.fallback.focus, 'cerebellum');
    assert.equal(result.fallback.nodes.length, anatomy.ANATOMY_MODELS.brain.parts.length);
    assert.equal(schemas.schematicVisualSchema.safeParse(result.fallback).success, true);
  }
});

test('anatomy fallback grid places labels in three columns', () => {
  assert.deepEqual({ ...anatomyParts.anatomyFallbackPosition(4, 3, 0.5) }, { x: 0.5, y: 0.5 });
});

for (const [label, respond, exists] of [
  ['an installed model', async () => ({ ok: true }), true],
  ['a missing model (404)', async () => ({ ok: false }), false],
  ['a network failure', async () => { throw new Error('offline'); }, false],
]) {
  test(`anatomy asset check reports ${exists ? 'ready' : 'missing'} for ${label} through a cancellable cached query`, async () => {
    let options; let requested;
    const signal = new AbortController().signal;
    const load_ = data => load('features/classroom/hooks/useAnatomyAsset.ts', {
      '@tanstack/react-query': { useQuery: given => { options = given; return { data }; } },
    }, { fetch: (url, init) => { requested = [url, init.method, init.signal]; return respond(); } }).useAnatomyAsset;
    assert.equal(load_(undefined)('/m/heart.glb'), 'checking');
    assert.deepEqual([...options.queryKey], ['classroom', 'anatomy-asset', '/m/heart.glb']);
    assert.equal(options.retry, false);
    assert.equal(await options.queryFn({ signal }), exists);
    assert.deepEqual(requested, ['/m/heart.glb', 'HEAD', signal]);
    assert.equal(load_(exists)('/m/heart.glb'), exists ? 'ready' : 'missing');
  });
}

test('every 3D diagram label uses the self-hosted font, never a runtime CDN download', async () => {
  const { readFile, readdir, stat } = await import('node:fs/promises');
  const { DIAGRAM_LABEL_FONT } = load('features/classroom/constants/diagramConstants.ts');
  const publicFont = new URL(`../../../public${DIAGRAM_LABEL_FONT}`, import.meta.url);
  assert.ok((await stat(publicFont)).size > 0);
  const dir = new URL('../../features/classroom/components/board/diagram/', import.meta.url);
  for (const file of (await readdir(dir)).filter(name => name.endsWith('.tsx'))) {
    const source = await readFile(new URL(file, dir), 'utf8');
    for (const tag of source.match(/<Text\b[^>]*>/g) ?? []) assert.match(tag, /font=\{DIAGRAM_LABEL_FONT\}/, `${file}: ${tag}`);
  }
});

test('diagram camera fits labelled scenes in wide and narrow panels', () => {
  const { diagramCameraDistance, fitDiagramCamera } = load('features/classroom/utilities/diagramCamera.ts');
  const { DIAGRAM_VIEW_BOUNDS } = load('features/classroom/constants/diagramConstants.ts');
  for (const aspect of [0.5, 0.68, 1, 1.6, 2.4]) {
    const distance = diagramCameraDistance(48, aspect);
    const halfHeight = distance * Math.tan(24 * Math.PI / 180);
    assert.ok(halfHeight >= DIAGRAM_VIEW_BOUNDS.halfHeight - 1e-9, `height fits at aspect ${aspect}`);
    assert.ok(halfHeight * aspect >= DIAGRAM_VIEW_BOUNDS.halfWidth - 1e-9, `width fits at aspect ${aspect}`);
  }
  assert.ok(diagramCameraDistance(48, 0.68) > diagramCameraDistance(48, 1.6));
  assert.ok(Number.isFinite(diagramCameraDistance(48, 0)) && Number.isFinite(diagramCameraDistance(48, NaN)));
  let length; let updated = false;
  fitDiagramCamera({ fov: 48, position: { setLength: value => { length = value; } }, updateProjectionMatrix: () => { updated = true; } }, 1.6);
  assert.equal(length, diagramCameraDistance(48, 1.6));
  assert.ok(updated);
});

test('polynomial graphs show readable numbered axes so roots can be read off', () => {
  const { axisTicks, visualGeometry } = load('features/classroom/utilities/structuredVisual.ts');
  assert.equal(JSON.stringify(axisTicks(-4, 4)), JSON.stringify([-4, -3, -2, -1, 0, 1, 2, 3, 4]));
  assert.equal(JSON.stringify(axisTicks(-4, 12)), JSON.stringify([-4, -2, 0, 2, 4, 6, 8, 10, 12]));
  assert.equal(axisTicks(0.1, 0.35).every(v => Number.isFinite(v) && String(v).length < 6), true);
  assert.equal(axisTicks(3, 3).length, 0);
  const geometry = visualGeometry({ kind: 'polynomial', coefficients: [-4, 0, 1], x_min: -4, x_max: 4 });
  const root = geometry.xTicks.find(tick => tick.value === 2);
  assert.ok(Math.abs(root.position - (40 + 6 / 8 * 520)) < 1e-9, 'tick 2 sits where the curve crosses y = 0');
  const { StructuredVisual } = load('features/classroom/components/board/diagram/StructuredVisual.tsx');
  const markup = renderToStaticMarkup(createElement(StructuredVisual, { visual: { kind: 'polynomial', coefficients: [-4, 0, 1], x_min: -4, x_max: 4 } }));
  assert.ok(markup.includes('data-axis-tick="x"') && markup.includes('data-axis-tick="y"'));
  assert.ok(!/<text[^>]*fill="white"/.test(markup), 'no white text on the light board');
});
