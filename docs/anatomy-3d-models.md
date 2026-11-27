# Anatomy 3D models

Medical lessons can show a real 3D organ model next to the teacher. The lesson AI chooses a curated model (`heart`, `brain` or `skeleton`). As it explains, it moves `focus` from part to part, and that part glows. Students can rotate and zoom. Everything renders in the student's browser with Three.js, so no GPU server or AI 3D generation is involved.

```json
{"action": "none", "visual": {"kind": "anatomy", "model": "heart", "focus": "left_ventricle"}}
```

The model is offered to the AI only when the topic mentions matching words (`ANATOMY_KEYWORDS`). Django and Zod both reject unknown models or parts, and an invalid visual never blocks the narration.

## Where things live

| Piece | Location |
|---|---|
| Backend contract and keywords | `backend/django_app/apps/classroom/constants/visuals.py` (`ANATOMY_PARTS`, `ANATOMY_KEYWORDS`) |
| Prompt | `backend/django_app/apps/classroom/prompts/conceptual_visual_prompt.py` (`ANATOMY_VISUAL_PROMPT`) |
| Frontend registry | `frontend/src/features/classroom/constants/anatomyVisualConstants.ts` |
| Viewer | `frontend/src/features/classroom/components/board/diagram/AnatomyVisual.tsx` |
| Model files | `frontend/public/classroom-assets/anatomy/3d/<model>.glb` |

The frontend and backend part lists must be identical. A test in `conceptual-visuals.test.mjs` fails if they drift.

## The model files are not in the repo yet

Until a GLB exists, the viewer shows a labelled 2D parts diagram in place of the 3D model, so lessons still work. To add a model:

1. **Download** Z-Anatomy (https://github.com/Z-Anatomy) and open the `.blend` file in Blender.
2. **Select only one system**, for example the heart, and delete or hide everything else. One full-body file is too heavy for phones.
3. **Rename the objects** (or a parent empty or collection that holds them) to exactly the part IDs: `left_ventricle`, `aorta`, `frontal_lobe`, `femur`, and so on. Only a number may follow (`aorta.001`, `aorta_2`). A longer name such as `aorta_wall` will **not** highlight; this strictness stops lookalikes like "Spine of scapula" from glowing as the spine. Meshes without a matching name still display; they just never highlight.
4. **Export** using File → Export → glTF 2.0, save it as `heart-export.glb` with *glTF Binary (.glb)*, *Selected objects* and *Apply modifiers*. Leave Blender's **Draco compression switched off**, because the viewer does not load a Draco decoder.
5. **Compress with Meshopt** (the viewer decodes Meshopt locally without contacting a third-party server). Compress the exported file (saved as `heart-export.glb` in step 4) into the final `heart.glb`:
   ```bash
   npx gltfpack -i heart-export.glb -o heart.glb -cc
   ```
   Don't add `-tc`: it converts textures to KTX2, which this viewer can't decode. Aim for under about 5 MB per model.
6. **Save** the file as `frontend/public/classroom-assets/anatomy/3d/heart.glb` (or `brain.glb` / `skeleton.glb`).
7. **Check it** by asking in the classroom "Explain the chambers of the heart". The model should load, and each chamber should glow as it is named.

## Licence (read before a commercial launch)

- Z-Anatomy is **CC BY-SA 4.0**. Commercial use is allowed, but the credit line (shown on the viewer as `ANATOMY_ATTRIBUTION`) must stay visible, and the **modified GLB files must also be shared under CC BY-SA 4.0**. This applies to the models only, not your app code.
- Check the Z-Anatomy repository for parts that come from sources with other licences, and leave out anything marked non-commercial.
- If you use a model from NIH 3D or Sketchfab, check that model's own licence, avoid "NC" licences, and update `ANATOMY_ATTRIBUTION`.
- Have someone with medical training review each model and its part names once before students see it.

## Adding another organ

Add the entry in three places: `ANATOMY_PARTS` and `ANATOMY_KEYWORDS` in the backend constants, and `ANATOMY_MODELS` in the frontend constants (same part IDs, same order). Then drop in the GLB. The `AnatomyModelId` type in `visual.types.ts` needs the new name too.
