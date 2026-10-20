import { HERO_ILLUSTRATIONS, HERO_TIME_BOUNDARIES, HERO_LIGHT_STOPS } from '../constants/heroAppearanceConstants';

/** Use the student's timezone, with browser-local time as a safe fallback. */
export function getHeroAppearance(date: Date, timezone?: string) {
  let hour = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
  if (timezone) {
    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
      }).formatToParts(date);
      const part = (type: string) => Number(parts.find((item) => item.type === type)?.value || 0);
      hour = part('hour') + part('minute') / 60 + part('second') / 3600;
    } catch {
      // Older profiles can contain an invalid timezone; retain browser-local time.
    }
  }
  const period = hour >= HERO_TIME_BOUNDARIES.night || hour < HERO_TIME_BOUNDARIES.day
    ? 'night' : hour >= HERO_TIME_BOUNDARIES.sunset ? 'sunset' : 'day';
  const greeting = hour >= HERO_TIME_BOUNDARIES.day && hour < HERO_TIME_BOUNDARIES.afternoon
    ? 'Good Morning' : hour >= HERO_TIME_BOUNDARIES.afternoon && hour < HERO_TIME_BOUNDARIES.sunset
      ? 'Good Afternoon' : 'Good Evening';
  const nextIndex = HERO_LIGHT_STOPS.findIndex((stop) => stop.hour > hour);
  const to = HERO_LIGHT_STOPS[nextIndex < 0 ? HERO_LIGHT_STOPS.length - 1 : nextIndex];
  const from = HERO_LIGHT_STOPS[Math.max(0, nextIndex - 1)];
  const blend = (hour - from.hour) / (to.hour - from.hour || 1);
  const daylight = from.day + (to.day - from.day) * blend;
  const sunset = from.sunset + (to.sunset - from.sunset) * blend;
  const night = from.night + (to.night - from.night) * blend;
  const sunProgress = Math.max(0, Math.min(1, (hour - 6) / 13));
  const moonProgress = ((hour + 4) % 24) / 10;
  const sceneStyle = {
    '--hero-day': daylight,
    '--hero-sunset': sunset,
    '--hero-night': night,
    '--hero-sun-x': `${49 + sunProgress * 38}%`,
    '--hero-sun-y': `${43 - Math.sin(sunProgress * Math.PI) * 34}%`,
    '--hero-moon-x': `${57 + Math.min(1, moonProgress) * 28}%`,
    '--hero-moon-y': `${13 + Math.min(1, moonProgress) * 10}%`,
  };
  return { period, greeting, ...HERO_ILLUSTRATIONS[period], sceneStyle };
}
