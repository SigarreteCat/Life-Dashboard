"use client";

import { useState } from "react";
import { Card } from "./Card";
import { useStoredState } from "@/lib/storage";
import { dayKey, lastNDays, streak, uid } from "@/lib/date";

type Habit = { id: string; name: string; done: Record<string, boolean> };

const STARTERS = ["Drink water", "Move 30 min", "Read"];

export function Habits({ className = "" }: { className?: string }) {
  const [habits, setHabits, loaded] = useStoredState<Habit[]>("habits", []);
  const [name, setName] = useState("");
  const days = lastNDays(7);
  const today = dayKey();

  function toggle(id: string, key: string) {
    setHabits(habits.map((h) => (h.id === id ? { ...h, done: { ...h.done, [key]: !h.done[key] } } : h)));
  }

  function add(n: string) {
    if (!n.trim()) return;
    setHabits([...habits, { id: uid(), name: n.trim(), done: {} }]);
  }

  return (
    <Card title="Habits · last 7 days" className={className}>
      {loaded && habits.length === 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {STARTERS.map((s) => (
            <button key={s} onClick={() => add(s)} className="rounded-full border border-line px-3 py-1 text-xs hover:border-accent">
              + {s}
            </button>
          ))}
        </div>
      )}
      {habits.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted">
                <th className="pb-2 text-left font-normal">Habit</th>
                {days.map((d) => (
                  <th key={dayKey(d)} className="w-8 pb-2 font-normal">
                    {d.toLocaleDateString(undefined, { weekday: "narrow" })}
                  </th>
                ))}
                <th className="w-12 pb-2 text-right font-normal">Streak</th>
              </tr>
            </thead>
            <tbody>
              {habits.map((h) => (
                <tr key={h.id} className="group">
                  <td className="py-1.5 pr-2">
                    <span className="mr-1">{h.name}</span>
                    <button
                      aria-label={`Delete ${h.name}`}
                      onClick={() => confirm(`Remove "${h.name}" and its history?`) && setHabits(habits.filter((x) => x.id !== h.id))}
                      className="text-muted opacity-0 hover:text-ink group-hover:opacity-100 focus:opacity-100"
                    >
                      ×
                    </button>
                  </td>
                  {days.map((d) => {
                    const k = dayKey(d);
                    const on = !!h.done[k];
                    return (
                      <td key={k} className="text-center">
                        <button
                          onClick={() => toggle(h.id, k)}
                          aria-label={`${h.name} on ${d.toDateString()}`}
                          aria-pressed={on}
                          className={`h-6 w-6 rounded-md border transition ${
                            on ? "border-good bg-good" : "border-line hover:border-good"
                          } ${k === today ? "ring-2 ring-accent/30 ring-offset-1 ring-offset-card" : ""}`}
                        />
                      </td>
                    );
                  })}
                  <td className="text-right tabular-nums text-muted">{streak(h.done)}🔥</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <form
        className="mt-3"
        onSubmit={(e) => {
          e.preventDefault();
          add(name);
          setName("");
        }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New habit…"
          className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </form>
    </Card>
  );
}
