# Folder Structure Rules

> Read this before creating any new file or folder in this repository.

---

## The Golden Rule — Screaming Architecture

The folder structure must **scream** its domain. A new engineer who opens the project must know exactly where every file belongs within 10 seconds.

```
features/classroom/   → "This is the classroom teaching screen"
features/ask/         → "This is the student Q&A screen"
features/intro/       → "This is the onboarding/intro screen"
```

---

## Frontend Structure (Canonical — Do Not Deviate)

```
frontend/src/
│
├── app/                          # NEXT.JS ROUTING ONLY
│   ├── layout.tsx                # Root layout — no logic
│   ├── page.tsx                  # Renders IntroScreen only
│   ├── classroom/
│   │   └── page.tsx              # Renders ClassroomLayout only
│   └── ask/
│       └── page.tsx              # Renders AskLayout only
│
├── components/
│   └── ui/                       # SHADCN COMPONENTS ONLY (auto-generated)
│       ├── button.tsx
│       ├── dialog.tsx
│       └── ...                   # Never modify directly — extend via wrappers
│
├── config/                       # Build-time configuration
│   └── env.ts                    # Validated env vars
│
├── features/                     # SELF-CONTAINED FEATURE MODULES
│   ├── intro/
│   │   ├── components/
│   │   ├── constants/
│   │   │   └── index.ts          # Barrel export ← REQUIRED
│   │   ├── hooks/
│   │   │   └── index.ts          # Barrel export ← REQUIRED
│   │   ├── styles/               # Feature-local CSS (intro.css)
│   │   ├── tests/
│   │   └── types/
│   │       └── index.ts          # Barrel export ← REQUIRED
│   │
│   ├── ask/
│   │   ├── components/
│   │   ├── hooks/
│   │   │   └── index.ts
│   │   ├── services/
│   │   ├── state/
│   │   ├── tests/
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── validators/
│   │
│   └── classroom/                        # ← FULLY AUDITED & CANONICAL
│       ├── components/
│       │   ├── ClassroomLayout.tsx       # Main layout orchestrator
│       │   ├── board/                    # Board/chalkboard sub-components
│       │   │   ├── EquationCard.tsx
│       │   │   ├── PaneHeader.tsx
│       │   │   ├── PrincipleItemRow.tsx
│       │   │   ├── PrinciplesList.tsx
│       │   │   ├── PrinciplesNotesPane.tsx
│       │   │   ├── SimulationCanvas.tsx
│       │   │   ├── SimulationHeader.tsx
│       │   │   ├── SimulationPane.tsx
│       │   │   ├── SplitWhiteboardStage.tsx
│       │   │   ├── ChalkboardStage.tsx
│       │   │   ├── board.types.ts        # Re-export shim → ../../types/board.types
│       │   │   └── index.ts
│       │   ├── input/
│       │   │   ├── FloatingInteractionBar.tsx
│       │   │   ├── InputBar.tsx
│       │   │   ├── MediaControlGroup.tsx
│       │   │   ├── QuestionInputField.tsx
│       │   │   ├── RaiseHandButton.tsx
│       │   │   ├── input.types.ts        # Re-export shim → ../../types/input.types
│       │   │   └── index.ts
│       │   ├── sidebar/
│       │   │   ├── ActiveLessonTree.tsx
│       │   │   ├── FilterPillButton.tsx
│       │   │   ├── KeyPointsPanel.tsx
│       │   │   ├── LessonNavigatorHeader.tsx
│       │   │   ├── LessonTopicItemRow.tsx
│       │   │   ├── LessonTreeHeader.tsx
│       │   │   ├── MobileDrawerBackdrop.tsx
│       │   │   ├── MobileDrawerHeader.tsx
│       │   │   ├── MobileSidebar.tsx
│       │   │   ├── NavTabButtonRow.tsx
│       │   │   ├── NavTabIcon.tsx
│       │   │   ├── NavTabList.tsx
│       │   │   ├── RosterSearchInput.tsx
│       │   │   ├── Sidebar.tsx
│       │   │   ├── StudentRosterRow.tsx
│       │   │   ├── StudentSummaryDot.tsx
│       │   │   ├── StudentSummaryRow.tsx
│       │   │   ├── StudentsCard.tsx
│       │   │   ├── StudentsCardHeader.tsx
│       │   │   ├── StudentsModal.tsx
│       │   │   ├── StudentsModalFilterBar.tsx
│       │   │   ├── StudentsModalHeader.tsx
│       │   │   ├── StudentsModalStatsBar.tsx
│       │   │   ├── SuggestionsList.tsx
│       │   │   ├── TopicItemTitle.tsx
│       │   │   ├── TopicLiveBadge.tsx
│       │   │   ├── TopicStatusDot.tsx
│       │   │   ├── VoiceSelector.tsx
│       │   │   ├── sidebar.types.ts      # Re-export shim → ../../types/sidebar.types
│       │   │   └── index.ts
│       │   ├── stage/
│       │   │   ├── ClassroomErrorBanner.tsx
│       │   │   ├── ClassroomMainStage.tsx
│       │   │   ├── LoadingOverlay.tsx
│       │   │   ├── SubtitleBar.tsx
│       │   │   ├── WelcomeOverlay.tsx
│       │   │   ├── stage.types.ts        # Re-export shim → ../../types/stage.types
│       │   │   └── index.ts
│       │   ├── teacher/
│       │   │   ├── TeacherAvatarSvg.tsx
│       │   │   ├── TeacherFigure.tsx
│       │   │   ├── TeacherGlowBackdrop.tsx
│       │   │   ├── teacher.types.ts      # Re-export shim → ../../types/teacher.types
│       │   │   └── index.ts
│       │   └── topbar/
│       │       ├── CourseInfoBadge.tsx
│       │       ├── HeaderActionGroup.tsx
│       │       ├── LeaveClassButton.tsx
│       │       ├── MobileMenuButton.tsx
│       │       ├── SessionProgressTimer.tsx
│       │       ├── TopBar.tsx
│       │       ├── topbar.types.ts       # Re-export shim → ../../types/topbar.types
│       │       └── index.ts
│       │
│       ├── constants/                    # Feature domain static data ← REQUIRED
│       │   ├── boardConstants.ts         # DEFAULT_PRINCIPLES, DEFAULT_PRIMARY_EQUATION
│       │   ├── inputConstants.ts         # DEFAULT_QUESTION_PLACEHOLDER
│       │   ├── sidebarConstants.ts       # DEFAULT_NAV_TABS, MOCK_STUDENTS, DEFAULT_ATTENDANCE_SUMMARY
│       │   └── index.ts                  # Barrel export ← REQUIRED
│       │
│       ├── hooks/                        # ALL non-UI logic ← REQUIRED
│       │   ├── useActiveLessonTree.ts
│       │   ├── useChunkPlayer.ts
│       │   ├── useClassroomApi.ts
│       │   ├── useClassroomLayout.ts
│       │   ├── useFloatingInteractionBar.ts
│       │   ├── useHeaderActionGroup.ts
│       │   ├── useKeyPointsPanel.ts
│       │   ├── useMobileMenuButton.ts
│       │   ├── useMobileSidebar.ts
│       │   ├── useNavTabList.ts
│       │   ├── usePrinciplesNotesPane.ts
│       │   ├── useStudentsCard.ts
│       │   ├── useStudentsModal.ts
│       │   ├── useTopBar.ts
│       │   ├── useTopicItemRow.ts
│       │   ├── useVoiceInput.ts
│       │   ├── useVoiceSelector.ts
│       │   └── index.ts                  # Barrel export ← REQUIRED
│       │
│       ├── services/
│       │   └── classroomService.ts
│       │
│       ├── state/
│       │   └── classroomSlice.ts
│       │
│       ├── tests/
│       │   ├── classroomService.test.ts
│       │   └── classroomSlice.test.ts
│       │
│       ├── types/                        # ALL TypeScript interfaces ← REQUIRED
│       │   ├── board.types.ts
│       │   ├── classroom.types.ts
│       │   ├── input.types.ts
│       │   ├── sidebar.types.ts
│       │   ├── stage.types.ts
│       │   ├── teacher.types.ts
│       │   ├── topbar.types.ts
│       │   └── index.ts                  # Barrel export ← REQUIRED
│       │
│       ├── utilities/                    # Pure helper functions ← REQUIRED
│       │   ├── classroomConfig.ts        # 3D scene layout config constants
│       │   ├── formulaUtils.tsx          # Math formula tokenizer (may contain JSX)
│       │   ├── imageUtils.ts             # isImageUrl, safeImageSrc
│       │   ├── keyboardUtils.ts          # createEnterKeyHandler
│       │   ├── styleUtils.ts             # getTopicItemRowStyles, getStudentSummaryVariantStyles
│       │   └── index.ts                  # Barrel export ← REQUIRED
│       │
│       ├── utils/                        # ← SHIM ONLY — do not add new files here
│       │   └── index.ts                  # export * from '../utilities'
│       │
│       └── validators/
│           └── classroom.schema.ts
│
├── hooks/                        # GENUINELY SHARED HOOKS ONLY
│   └── useAppStore.ts            # Typed Redux dispatch/selector
│
├── lib/                          # GENUINELY SHARED UTILITIES
│   └── apiClient.ts              # Axios instance with base URL
│
├── shared/                       # GENUINELY SHARED UI
│   ├── components/
│   │   └── providers/
│   └── types/                    # Types used across 2+ features
│
├── store/                        # REDUX STORE CONFIG ONLY
│   ├── index.ts
│   └── uiStore.ts                # Global UI state (mobile sidebar toggle)
│
└── styles/                       # GLOBAL STYLES (see styles section below)
    ├── globals.css               # Entry: imports Tailwind + sub-stylesheets
    ├── theme.css                 # @theme design tokens (colors, fonts, spacing)
    ├── base.css                  # Resets and typography
    ├── glassmorphism.css         # Glass UI utilities
    ├── animations.css            # Keyframe animations
    └── overrides.css             # Vendor/browser overrides
```

---

## Decision Rules: Where Does a New File Go?

**Q: Is this a React component?**
→ `features/<feature>/components/<subgroup>/<ComponentName>.tsx`

**Q: Is this a custom hook?**
→ Single feature → `features/<feature>/hooks/use<Name>.ts`
→ Used by 2+ features → `hooks/` (global)

**Q: Is this a TypeScript interface or type?**
→ Single feature → `features/<feature>/types/<area>.types.ts`
→ Used by 2+ features → `shared/types/`

**Q: Is this a pure helper function (no React, no Redux)?**
→ `features/<feature>/utilities/<area>Utils.ts`

**Q: Is this static mock data or a default value?**
→ `features/<feature>/constants/<area>Constants.ts`

**Q: Is this an API call / service?**
→ `features/<feature>/services/<feature>Service.ts`

**Q: Is this a Shadcn component?**
→ `src/components/ui/<name>.tsx` (auto-generated by `npx shadcn add`)

---

## Anti-Patterns: What NOT to Do

```
❌ Defining an interface inside a .tsx component file
❌ Calling useAppSelector / useState inside a presentational component
❌ Putting mock data arrays inline in a component file
❌ Writing inline event handlers with logic (anything beyond calling a hook function)
❌ Creating a new utils/ folder — use utilities/ only
❌ Importing from a sibling component's local types file instead of central types/
❌ Skipping the barrel index.ts file for any folder
❌ Using <div role="button"> instead of <button type="button">
❌ Shadcn source modifications — extend via wrapper components instead
```

---

## Backend Structure (Canonical — Do Not Deviate)

```
backend/
├── config/
│   ├── settings.py               # All env-var driven — no hardcoding
│   ├── urls.py
│   └── wsgi.py
├── teacher/                      # Ask Feature
│   ├── services/
│   ├── tests/
│   ├── inference.py
│   ├── serializers.py
│   ├── urls.py
│   └── views.py                  # Thin routing only
├── physics_teacher/              # Classroom Feature
│   ├── prompts/
│   ├── services/
│   ├── tests/
│   ├── urls.py
│   └── views.py                  # Thin routing only (~85 lines)
├── .env.example
├── .env                          # NOT in Git
└── requirements.txt              # All packages pinned to == versions
```
