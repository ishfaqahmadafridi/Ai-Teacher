"""Compact schematic contract and optional topic-specific assembly instructions."""

CONCEPTUAL_VISUAL_PROMPT = """
## CONCEPTUAL VISUALS
Use diagram_type default, action none and diagram.visual for labelled processes,
logic, relationships or unsupported structures. Keep kind/nodes/edges inside visual.
Schematic shape: {"kind":"schematic","title":"Process","nodes":[
{"id":"a","label":"Input","x":0.1,"y":0.5},
{"id":"b","label":"Output","x":0.9,"y":0.5}],
"edges":[{"source":"a","target":"b","label":"transforms"}],"focus":"a"}.
Max 12 unique nodes, 24 unique edges; x/y in 0..1, distinct existing edge endpoints,
IDs <=40 characters, labels/title <=80; keep labels separated. Focus references an
existing node; omit it when unhighlighted, never use "none"/"all". A fallback_visual
uses this same complete shape. Do not force visuals for conversational replies.
"""

ASSEMBLY_VISUAL_PROMPT = """
## OPTIONAL ASSEMBLIES
Use 3D only when spatial relationships help. diagram.visual shape:
{"kind":"assembly","model":"MODEL","focus":"PART"}, with default/none envelope.
Only these relevant builders/parts are available: {assembly_catalog}.
Focus must exist; omit when unhighlighted. Optional phase 0..1 moves only a piston.
Never invent builders, meshes, model URLs or simulation claims; use a schematic instead.
"""

MOLECULE_VISUAL_PROMPT = """
For molecule, molecule is required: water (O,H,H), carbon_dioxide (C,O,O) or methane
(C,H,H,H,H). Atom IDs follow atom_0 onward in that order. Focus an existing atom or
bonds; do not claim chemical simulation or bond-order accuracy.
"""
