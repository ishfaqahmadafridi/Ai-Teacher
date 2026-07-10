// ─── Zustand UI store ─────────────────────────────────────────────────────────
// Lightweight UI-only state. Intentionally NOT in Redux.
// Rule: If only 1–2 components care about it, use Zustand — not Redux.

import { create } from 'zustand';

interface UIState {
  // Sidebar
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;

  // Diagram / media panel
  mediaPanelOpen: boolean;
  setMediaPanelOpen: (open: boolean) => void;

  // Theme (future)
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

export const useUIStore = create<UIState>((set) => ({
  mobileSidebarOpen: false,
  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
  toggleMobileSidebar: () =>
    set((s) => ({ mobileSidebarOpen: !s.mobileSidebarOpen })),

  mediaPanelOpen: false,
  setMediaPanelOpen: (open) => set({ mediaPanelOpen: open }),

  theme: 'dark',
  setTheme: (theme) => set({ theme }),
}));
