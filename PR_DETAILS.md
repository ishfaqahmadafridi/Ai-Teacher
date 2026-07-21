# PR Description: Landing Page Cleanup & Component Modularization

This PR cleans up the homepage (intro screen) to only render the visual components matching the target layout (ambient particle canvases and category marquee tracks) and reorganizes the landing page components into a clean, modular structure.

## Changes Included

### 1. Component Restructuring & Modularization
Moved all intro screen component files into a dedicated `src/features/intro/components/intro` folder and extracted the inline JSX structures into dedicated modular components:
* **`BackgroundCanvas.tsx`**: Wraps the particle background animation canvas, floating symbols, and ambient blur lights.
* **`CTAButton.tsx`**: Encapsulates the platform entry CTA button with its custom hover/active scaling states and router navigation.
* **`CategoryScrollingTracks.tsx`**: Wraps the infinite looping category track lanes.
* **`IntroScreen.tsx`**: Cleaned up to reference the modular sub-components.

### 2. Marketing Page & Component Pruning
Deleted unused marketing pages and components that are no longer part of the landing flow, ensuring a lightweight and maintainable frontend workspace:
* Pruned pages/routes: `/solutions`, `/roadmap`, `/security`
* Pruned component files: `Navbar.tsx`, `Footer.tsx`, `Statistics.tsx`, `WorkflowTimeline.tsx`, `ProductExperience.tsx`, `Roadmap.tsx`, `MultiDevice.tsx`, `Testimonials.tsx`, `TransitionOverlay.tsx`
* Pruned hook files: `useScrollReveal.ts`

### 3. Build & Style Integrity
* Adjusted global Tailwind styling definitions and CSS rules in `intro.css` to align with the modular layouts.
* Verified that the application compiles perfectly with `npm run build` with zero compiler, typescript, or ESLint errors.
