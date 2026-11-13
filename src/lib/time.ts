export const DEFAULT_WEEKDAY = 5; // Friday (0 = Sunday)
export const DEFAULT_HOUR = 14;
export const DEFAULT_MINUTE = 0;

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/** Midnight (local time) of the given date. */
export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Calendar day `offset` days after `date`, at local midnight. DST-safe. */
export function addDays(date: Date, offset: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + offset);
}

/** Combine a calendar day with a local time of day. */
export function atTime(day: Date, hour: number, minute: number): Date {
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute);
}

/** The next upcoming day with `weekday` at `hour:minute`, strictly after `now`. */
export function nextOccurrence(
  now: Date,
  weekday = DEFAULT_WEEKDAY,
  hour = DEFAULT_HOUR,
  minute = DEFAULT_MINUTE,
): Date {
  const today = startOfDay(now);
  const delta = (weekday - today.getDay() + 7) % 7;
  const candidate = atTime(addDays(today, delta), hour, minute);
  return candidate.getTime() > now.getTime()
    ? candidate
    : atTime(addDays(today, delta + 7), hour, minute);
}

/** The selectable days: today plus the following `count - 1` days. */
export function dayOptions(now: Date, count = 8): Date[] {
  const today = startOfDay(now);
  return Array.from({ length: count }, (_, i) => addDays(today, i));
}

/** Split a duration into days/hours/minutes/seconds. Negative durations clamp to zero. */
export function countdown(fromMs: number, toMs: number): Countdown {
  const total = Math.max(0, Math.floor((toMs - fromMs) / 1000));
  return {
    days: Math.floor(total / 86_400),
    hours: Math.floor((total % 86_400) / 3_600),
    minutes: Math.floor((total % 3_600) / 60),
    seconds: total % 60,
  };
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function dayLabel(day: Date, now: Date): string {
  const today = startOfDay(now);
  if (isSameDay(day, today)) return "I dag";
  if (isSameDay(day, addDays(today, 1))) return "I morgen";
  return capitalize(day.toLocaleDateString(LOCALE, { weekday: "long" }));
}

/** Norwegian bokmål; date names come out lowercase ("fredag"). */
export const LOCALE = "nb-NO";

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}
