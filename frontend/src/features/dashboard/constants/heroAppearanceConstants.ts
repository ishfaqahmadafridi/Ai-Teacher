export const HERO_TIME_BOUNDARIES = { day: 6, afternoon: 12, sunset: 17, night: 20 } as const;

export const HERO_FOREGROUND_IMAGE = '/images/student_study_foreground.png';
export const HERO_ILLUSTRATIONS = {
  day: { imageSrc: HERO_FOREGROUND_IMAGE, imageAlt: 'Student studying in daylight with a sunny sky outside the window' },
  sunset: { imageSrc: HERO_FOREGROUND_IMAGE, imageAlt: 'Student studying in warm evening light with sunset outside the window' },
  night: { imageSrc: HERO_FOREGROUND_IMAGE, imageAlt: 'Student studying by lamplight with the moon and stars outside the window' },
} as const;

// Blend through these local wall-clock hours; never run a sped-up day/night loop.
export const HERO_LIGHT_STOPS = [
  { hour: 0, day: 0, sunset: 0, night: 1 },
  { hour: 5, day: 0, sunset: 0, night: 1 },
  { hour: 7, day: 1, sunset: 0, night: 0 },
  { hour: 16, day: 1, sunset: 0, night: 0 },
  { hour: 18, day: 0, sunset: 1, night: 0 },
  { hour: 20, day: 0, sunset: 0, night: 1 },
  { hour: 24, day: 0, sunset: 0, night: 1 },
] as const;
