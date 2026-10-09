export const nightEvents = [
  "RADIO STATIC: something is following the car.",
  "LOW FUEL: the needle drops faster than expected.",
  "TIRE WARNING: pressure is falling.",
  "NO SIGNAL: GPS marks a road that does not exist.",
  "FIGURE ON ROAD: it stops when headlights hit it."
] as const;
export type NightEvent = typeof nightEvents[number];
export const NIGHT_EVENT_WEIGHTS = [24,20,20,18,18] as const;