# Frontend Components & CSS Rules

> Read this before creating or modifying any React components, styles, or hooks in the frontend.

---

## 1. Premium Visual Design & Aesthetics

This project is built to feel premium, modern, and visually stunning. Avoid default browser elements, generic colors, or standard layout styles.

### Non-Negotiable Aesthetics:
- **Curated Color Palettes:** Use tailored HSL variables or custom color themes (sleek dark modes, deep space blues, neon accents, or vibrant emerald greens) rather than default primary colors.
- **Glassmorphism:** Use translucent backdrops (`backdrop-filter: blur(12px)`) with thin borders and soft drop shadows to create a layered, state-of-the-art interface.
- **Smooth Gradients:** Incorporate dual/triple stop gradients for backgrounds, text headings, and interactive hover states.
- **Micro-Animations:** Use subtle hover transformations, spring transitions, and keyframe animations to make the UI feel alive and responsive.
- **Typography:** Import clean, modern fonts from Google Fonts (e.g. Outfit, Inter, Roboto, Plus Jakarta Sans) rather than basic sans-serif.

---

## 2. Style Isolation — Feature Styles vs Tailwind CSS

Unless the user explicitly asks for Tailwind CSS utility classes, use isolated vanilla CSS modules or clean feature-local stylesheets.

```
✅ features/intro/styles/intro.css           ← Local CSS file loaded in the feature
✅ shared/components/FormulaBlock.css       ← Shared component CSS file
❌ inline style={{ backgroundColor: 'red' }} ← Hardcoded inline styles (strictly banned)
```

If Tailwind is explicitly requested, follow these rules:
- Configure Tailwind colors in `tailwind.config.js` using semantic variables (e.g. `bg-primary`, `text-secondary`).
- Never use arbitrary values (e.g. `w-[245px]`, `bg-[#f0f3f6]`) inside components. Move these to layout configurations or config objects.

---

## 3. Atomic Components & Folder Boundaries

Components should be small, focused, and single-purpose. If a component grows past 200 lines, split it into smaller atomic units.

```
features/classroom/components/
├── board/
│   ├── ChalkboardCanvas.tsx   ← Atomic component (handles chalk drawings)
│   ├── FormulaBlock.tsx       ← Atomic component (handles equation rendering)
│   └── BoardStage.tsx         ← Orchestrator component (binds drawings & formulas)
├── sidebar/
│   ├── VoiceSelector.tsx      ← Atomic component (dropdown)
│   ├── LessonOutline.tsx      ← Atomic component (list)
│   └── ControlSidebar.tsx     ← Orchestrator component (binds selectors & outlines)
└── ClassroomLayout.tsx         ← Main Page Layout orchestrator
```

**Rule:** Sub-components that are only used within a single orchestrator component should be placed in sub-folders within the feature's `components/` directory (e.g. `features/classroom/components/board/`).

---

## 4. Custom Hook Separation of Concerns

Every component should only concern itself with rendering UI. Any state initialization, event listeners, canvas loops, Web Audio, or speech recognition must be delegated to a custom hook.

```typescript
// ✅ CORRECT — UI is thin, delegates rendering states and commands to hooks
// features/classroom/components/board/ChalkboardCanvas.tsx
import { useAppSelector } from '@/hooks/useAppStore';

export function ChalkboardCanvas() {
  const points = useAppSelector((state) => state.classroom.chalkboardPoints);
  const isWriting = useAppSelector((state) => state.classroom.isWritingOnBoard);

  // Hook details or state are read from store, canvas loop is handled by hook
  return (
    <canvas className="chalkboard-draw-layer" ... />
  );
}
```

---

## 5. Cleaning Up in Hooks (No Memory Leaks)

Any animation loop (using `requestAnimationFrame`), interval, timeout, event listener, or SpeechSynthesis engine MUST be cleaned up on unmount.

```typescript
// ✅ CORRECT — Cancel active loops, remove event listeners on unmount
// features/intro/hooks/useParticleCanvas.ts
export function useParticleCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animFrameId: number;

    const tick = () => {
      // Draw canvas frames...
      animFrameId = requestAnimationFrame(tick);
    };
    
    animFrameId = requestAnimationFrame(tick);

    const handleResize = () => { /* resize logic */ };
    window.addEventListener('resize', handleResize);

    // Return cleanup callback
    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [canvasRef]);
}
```

---

## 6. JSX Best Practices

- **Explicit Key Prop:** When mapping items in JSX, always use a unique, stable key. Never use the array index if the items can re-order, delete, or sort.
- **Form Labels:** Every interactive input must have a corresponding `<label>` tag with `htmlFor` or be nested inside a label, keeping the UI accessible.
- **Conditional Rendering:** Keep logical branches clean. Prefer ternary operators or clean early returns over deep conditional nesting.

---

## Component Creation Checklist

Before declaring a component or hook complete, verify:

- [ ] Does it meet the premium visual standards (modern typography, margins, interactive hover styles)?
- [ ] Is it under 200 lines? If not, did you split it into smaller files?
- [ ] Is all side-effect/subscription logic extracted to a hook?
- [ ] Did you implement proper cleanups (cleared timeouts, intervals, event listeners, RAF)?
- [ ] Are all constants/layout dimensions extracted into a config file?
- [ ] Are all styles contained within a feature CSS module/file or configured Tailwind classes?
