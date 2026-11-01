/** Local calendar date as YYYY-MM-DD (not UTC, so "today" matches the user's day). */
export function dayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** The last `n` days, oldest first, ending today. */
export function lastNDays(n: number, from: Date = new Date()): Date[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(from);
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() - (n - 1 - i));
    return d;
  });
}

/** Consecutive days ending today (or yesterday, if today isn't done yet). */
export function streak(done: Record<string, boolean>, today: Date = new Date()): number {
  const d = new Date(today);
  d.setHours(12, 0, 0, 0);
  if (!done[dayKey(d)]) d.setDate(d.getDate() - 1);
  let count = 0;
  while (done[dayKey(d)]) {
    count++;
    d.setDate(d.getDate() - 1);
  }
  return count;
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
