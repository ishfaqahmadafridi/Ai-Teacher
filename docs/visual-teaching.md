# Visual teaching: single-resistor lesson

The circuit renderer is an inline SVG with voltage/resistance controls and deterministic I = V/R calculation. It depicts one ideal ohmic resistor at constant temperature, not a general circuit solver. No LLM is needed to update values or draw it.

For an Ohm's Law example, the teacher returns diagram_type circuit and diagram.parameters containing voltage (0–48 V) and resistance (1–100 ohms). Backend serializers and frontend Zod validate finite numbers and matching limits. Later chunks retain the circuit values when their command omits parameters. New parameter pairs reset the exploratory controls through React keys. Without supplied parameters, the UI explicitly labels its 12 V / 4 ohm example as illustrative.

The existing rendered-figure capture now supports this SVG as well as WebGL canvases. It converts the current diagram to PNG for private saved notes and DOCX reuse. A failed snapshot must not interrupt speech. Exported figures are snapshots; interactive controls are not embedded in Word. If a student adjusts values before capture, the snapshot reflects those displayed values.

Speech and formulas must describe the actual supplied example. These schema checks do not establish that all narrated mathematics are correct. The current model must not claim support for multi-component circuits, anatomy models, molecular animations or arbitrary simulations.

Topic titles now update from the new answer. Formula/image-only content can appear with diagram_type default. Automatic external image retrieval, reviewed biology/medical assets, general process diagrams and full browser visual testing remain outstanding.

## Reviewed anatomy images
The backend supplies a small reviewed OpenStax image catalog to the existing generation call. The teacher selects an asset ID for relevant anatomical chunks; unknown IDs fail validation. The backend resolves the ID to a same-origin illustration, preserving source and CC BY credit in annotations. The frontend displays the full labelled image alongside the current explanation and captures it into private notes for DOCX reuse. No extra LLM call generates the images. See frontend/public/classroom-assets/README.md for provenance.

These are static diagrams, not organ animations or diagnostic tools. New lessons use these instructions; previously saved lesson versions remain unchanged. Source accuracy and depth still need lesson-level review; prompt instructions alone do not guarantee every organ is covered.
