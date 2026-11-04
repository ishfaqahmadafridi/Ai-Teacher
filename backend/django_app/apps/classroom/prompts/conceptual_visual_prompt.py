"""Contract for bounded educational diagrams and procedural models."""

CONCEPTUAL_VISUAL_PROMPT = """
CONCEPTUAL VISUALS
When a small concept benefits from a visual, choose the simplest supported format.
Use labelled schematics for processes, computer science logic, medical relationships,
and unsupported structures. Use 3D only when spatial relationships aid understanding.
Do not force a visual for conversational replies or claim medical/anatomical accuracy.
Explain the whole briefly, then one named part and its role at a time, then ask a
short understanding question. Reuse the same visual and IDs across those chunks,
changing focus to match the part currently explained. Continue the teaching cycle.
Omit focus when nothing is highlighted; never use the strings "none" or "all".

Use diagram_type "default", diagram.action "none", and diagram.visual:
Always keep the envelope, for example:
{"diagram":{"action":"none","visual":{"kind":"assembly","model":"pulley","focus":"rope"}}}.
Never put kind, model, nodes or edges directly inside diagram. Always include action.
- Schematic: {"kind":"schematic","title":"Process","nodes":[
  {"id":"input","label":"Input","x":0.1,"y":0.5},
  {"id":"output","label":"Output","x":0.9,"y":0.5}],
  "edges":[{"source":"input","target":"output","label":"transforms"}],"focus":"input"}.
  Maximum 12 unique nodes, 24 unique edges; coordinates within 0..1; separate nodes
  sufficiently to keep labels legible. IDs <=40 characters, labels/title <=80.
  Edges reference existing distinct nodes; focus references an existing node.
- Assembly: {"kind":"assembly","model":"bridge","focus":"deck"}.
  Approved builders and focus IDs: {assembly_catalog}.
  For model "molecule", molecule is REQUIRED: water, carbon_dioxide, or methane.
  Atom IDs follow the approved molecule order: water O,H,H; carbon_dioxide C,O,O;
  methane C,H,H,H,H. Focus only an existing atom or "bonds".
  Optional phase 0..1 controls only the piston position; it is not a physical simulation.
  These are simplified parts models, not accurate anatomy, CAD, stress calculations,
  chemical simulations, or bond-order diagrams. State relevant simplifications.
Never invent builders, coordinates for arbitrary 3D meshes, executable code, external
model URLs, or unsupported assets. Choose a labelled schematic instead.
For image-dependent steps, also provide diagram.fallback_visual: a complete supported
schematic illustrating exactly that step if retrieval fails. Label it as simplified,
not as the requested anatomical image. Prefer a primary schematic for relationships
and processes; reserve image queries for details that benefit from real illustrations.
"""
