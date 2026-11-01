"use client";

import { useState } from "react";
import { Card } from "./Card";
import { useStoredState } from "@/lib/storage";
import { uid } from "@/lib/date";

type Task = { id: string; text: string; done: boolean };

export function Focus() {
  const [tasks, setTasks] = useStoredState<Task[]>("tasks", []);
  const [text, setText] = useState("");

  const left = tasks.filter((t) => !t.done).length;

  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setTasks([...tasks, { id: uid(), text: text.trim(), done: false }]);
    setText("");
  }

  return (
    <Card
      title="Today's focus"
      action={
        tasks.some((t) => t.done) && (
          <button className="text-xs text-muted hover:text-ink" onClick={() => setTasks(tasks.filter((t) => !t.done))}>
            clear done
          </button>
        )
      }
    >
      <form onSubmit={add} className="mb-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add something to do…"
          className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </form>
      {tasks.length === 0 ? (
        <p className="text-sm text-muted">Nothing yet. What matters most today?</p>
      ) : (
        <ul className="space-y-1">
          {tasks.map((t) => (
            <li key={t.id} className="group flex items-center gap-3 rounded-lg px-1 py-1.5">
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => setTasks(tasks.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))}
                className="h-4 w-4 accent-[var(--accent)]"
              />
              <span className={`flex-1 text-sm ${t.done ? "text-muted line-through" : ""}`}>{t.text}</span>
              <button
                aria-label="Delete"
                onClick={() => setTasks(tasks.filter((x) => x.id !== t.id))}
                className="text-muted opacity-0 hover:text-ink group-hover:opacity-100 focus:opacity-100"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      {tasks.length > 0 && <p className="mt-3 text-xs text-muted">{left === 0 ? "All done 🎉" : `${left} left`}</p>}
    </Card>
  );
}
