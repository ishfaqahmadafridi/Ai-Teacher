// ─── Centralized application route paths ─────────────────────────────────────

export const ROUTES = {
  classroom: '/',
  ask: '/ask',
  api: {
    explain: '/api/physics-teacher/explain/',
    ask: '/api/physics-teacher/ask/',
    health: '/api/physics-teacher/health/',
  },
} as const;

export type AppRoute = typeof ROUTES[keyof Omit<typeof ROUTES, 'api'>];
export type ApiRoute = typeof ROUTES.api[keyof typeof ROUTES.api];
export default ROUTES;
