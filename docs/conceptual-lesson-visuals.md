# Conceptual classroom visuals

The existing lesson-generation call can produce labelled 2D schematics or select an approved procedural 3D builder. React Three Fiber renders the models in the student's browser using the project's existing Three.js dependencies. No GPU server or text-to-3D generation service is required.

Supported 3D builders are bridge, beam, piston, pulley, and three simple molecules: water, carbon dioxide and methane. Each exposes a fixed set of named parts. The teacher can retain a model across steps and change `focus` as it explains each part. Students can rotate and zoom. Piston `phase` changes its illustrative position. These are conceptual models, not CAD, accurate anatomy, bond-order diagrams or engineering simulations. Other subjects can use labelled schematics or the existing retrieved-image system.

The prompt contract lives in `backend/django_app/apps/classroom/prompts/conceptual_visual_prompt.py`. DRF validates bounded coordinates, graph references, model choices and focus IDs; frontend Zod schemas also validate visual data. Invalid optional visuals do not invalidate narration. Models use fixed local geometry; generated JavaScript, arbitrary meshes and external model URLs are never executed. When WebGL is unavailable, the model becomes a labelled 2D parts inventory rather than a geometric projection.

Generated diagrams receive canonical actions and nested visual data on both write and read, including legacy saved answers. Gemini requests JSON MIME output. No-focus sentinels are removed, while unknown part IDs are rejected. Colliding schematic placements receive a bounded grid layout without changing node IDs or edges.

Image-dependent steps may include a complete validated `diagram.fallback_visual`. If retrieval fails, the service uses only that step's supplied fallback and the classroom explicitly labels it as a simplified substitute. Without a fallback, the unavailable-image message remains. This does not repair external connectivity or automatically add diagrams to older notes. See [the live fix verification](testing/lecture-visual-fixes-verification.md).

Visual instructions remain in the existing saved lesson chunks and follow the existing ORM/API recovery flow. Rendering and changing focus need no additional AI calls. This does not add a cache for new or differently worded generation requests. Existing image retrieval and licensed-asset storage remain separate.

## Gemini quota fallback

Gemini remains primary. When its invocation fails with explicit HTTP 429, including the original Gemini error wrapped by LangChain, Django makes one Groq text-chat request. Other errors are propagated to the existing classroom failure handling. Missing primary configuration does not silently switch providers. Groq failures do not trigger retry loops. Provider/model metadata and token usage reflect a successful fallback response.

Server configuration, loaded through the existing dotenv setup:

```dotenv
GEMINI_API_KEY=your_existing_key
GROQ_API_KEY=your_groq_key
CLASSROOM_GROQ_MODEL=llama-3.3-70b-versatile
```

Keep keys server-side. Restart Django and lesson workers after configuration/code changes. The fallback uses the existing timeout and caps completion output at 4096 tokens. Very long lessons can exceed that cap and fail existing validation; fallback does not guarantee full curriculum coverage. It supports text messages, not image-based verification. Provider free-tier eligibility, limits, billing settings and key validity must be checked in the provider account; configured keys alone do not establish those facts. No paid API calls were made for verification.

Try questions such as “Show a conceptual bridge and explain its deck and supports,” “Explain a piston and its rod,” or “Show water in 3D and explain the atoms.” Diagram choice and explanatory accuracy still depend on the model response.
