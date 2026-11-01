"use client";

import { Card } from "./Card";
import { useStoredState } from "@/lib/storage";

export function Notes() {
  const [text, setText] = useStoredState("notes", "");
  return (
    <Card title="Notes">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ideas, reminders, gratitude… saved automatically."
        className="h-40 w-full resize-y rounded-lg border border-line bg-transparent p-3 text-sm leading-relaxed outline-none focus:border-accent"
      />
    </Card>
  );
}
