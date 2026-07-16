// ─── Classroom layout configuration ──────────────────────────────────────────
// All 3D positioning constants live here so components never hardcode values.

export const CLASSROOM_LAYOUT = {
  chalkboard: {
    y: 0.45,
    z: -1.2,
    height: 3.8,
    centered: {
      x: 0,
      width: 8.5,
      borderWidth: 8.8,
      textX: -2.2,
      textMaxWidth: 6.0,
    },
    shifted: {
      x: -1.4,
      width: 5.2,
      borderWidth: 5.5,
      textX: -1.8,
      textMaxWidth: 2.8,
    },
  },
  mediaScreen: {
    x: 2.7,
    y: 0.45,
    z: -1.2,
    width: 2.6,
    height: 3.6,
    imageWidth: 2.4,
    imageHeight: 1.8,
  },
  teacher: {
    y: -1.4,
    z: 1.2,
    scale: 1.4,
    positions: {
      left: -3.0,
      right: 3.0,
      center: 0,
    },
  },
  camera: {
    position: [0, 0, 7] as [number, number, number],
    fov: 48,
  },
} as const;

export type TeacherXPosition =
  (typeof CLASSROOM_LAYOUT.teacher.positions)[keyof typeof CLASSROOM_LAYOUT.teacher.positions];
