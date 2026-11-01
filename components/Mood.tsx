"use client";

import { Card } from "./Card";
import { useStoredState } from "@/lib/storage";
import { dayKey, lastNDays } from "@/lib/date";

const LEVELS = [
  { v: 1, face: "😞", label: "Rough" },
  { v: 2, face: "😕", label: "Meh" },
  { v: 3, face: "😐", label: "Okay" },
  { v: 4, face: "🙂", label: "Good" },
  { v: 5, face: "😄", label: "Great" },
];

export function Mood() {
  const [log, setLog] = useStoredState<Record<string, number>>("mood", {});
  const today = dayKey();
  const days = lastNDays(14);
  const recent = days.map((d) => log[dayKey(d)]).filter(Boolean);
  const avg = recent.length ? recent.reduce((a, b) => a + b, 0) / recent.length : 0;

  return (
    <Card title="Mood">
      <p className="mb-3 text-sm">How are you feeling today?</p>
      <div className="flex justify-between gap-1">
        {LEVELS.map((l) => (
          <button
            key={l.v}
            onClick={() => setLog({ ...log, [today]: l.v })}
            aria-pressed={log[today] === l.v}
            className={`flex flex-1 flex-col items-center rounded-xl border py-2 transition ${
              log[today] === l.v ? "border-accent bg-accent-soft" : "border-transparent hover:border-line"
            }`}
          >
            <span className="text-2xl">{l.face}</span>
            <span className="mt-1 text-[11px] text-muted">{l.label}</span>
          </button>
        ))}
      </div>
      <div className="mt-5">
        <div className="flex h-12 items-end gap-1" aria-label="Mood over the last 14 days">
          {days.map((d) => {
            const v = log[dayKey(d)];
            return (
              <div
                key={dayKey(d)}
                title={`${d.toLocaleDateString(undefined, { month: "short", day: "numeric" })}: ${v ? LEVELS[v - 1].label : "no entry"}`}
                className={`flex-1 rounded-sm ${v ? "bg-accent" : "bg-line"}`}
                style={{ height: v ? `${v * 20}%` : "8%", opacity: v ? 0.35 + v * 0.13 : 1 }}
              />
            );
          })}
        </div>
        <p className="mt-2 text-xs text-muted">
          Last 14 days{avg ? ` · average ${LEVELS[Math.round(avg) - 1].label.toLowerCase()} (${avg.toFixed(1)})` : ""}
        </p>
      </div>
    </Card>
  );
}
