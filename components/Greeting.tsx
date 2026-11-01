"use client";

import { useEffect, useState } from "react";
import { useStoredState } from "@/lib/storage";

function partOfDay(h: number) {
  if (h < 5) return "Good night";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function Greeting() {
  const [now, setNow] = useState<Date | null>(null);
  const [name, setName] = useStoredState("name", "");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000 * 15);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-sm text-muted">
          {now?.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }) ?? " "}
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
          {now ? partOfDay(now.getHours()) : "Hello"}
          {editing ? (
            <form
              className="inline"
              onSubmit={(e) => {
                e.preventDefault();
                setEditing(false);
              }}
            >
              {", "}
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setEditing(false)}
                placeholder="your name"
                className="w-40 border-b border-line bg-transparent outline-none"
              />
            </form>
          ) : (
            <button onClick={() => setEditing(true)} className="hover:text-accent" title="Set your name">
              {name ? `, ${name}` : ""}
            </button>
          )}
          {!editing && !name && (
            <button onClick={() => setEditing(true)} className="ml-3 align-middle text-sm font-normal text-accent">
              add your name
            </button>
          )}
        </h1>
      </div>
      <p className="text-4xl font-light tabular-nums text-muted sm:text-5xl">
        {now?.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }) ?? ""}
      </p>
    </div>
  );
}
